
export interface CarData {
    price: number;
    firstRegistrationDate: Date;
    co2Emissions: number; // g/km
    isProfessionalSeller: boolean;
    engineSize?: number; // cc, optional for now
    fuelType?: string;
}

export interface CostBreakdown {
    vehiclePrice: number;
    vat: number; // IVA
    registrationTax: number; // Impuesto de Matriculación
    importDuty: number; // Aranceles (usually 0 for EU)
    transportCost: number;
    itvFee: number;
    trafficFee: number; // Tasas DGT
    agencyFee: number; // Gestoría
    platesFee: number;
    itp: number; // Impuesto de Transmisiones Patrimoniales (if private seller)
    total: number;
}

export const CONSTANTS = {
    VAT_RATE: 0.21,
    TRANSPORT_COST: 850,
    ITV_FEE: 150,
    TRAFFIC_FEE: 99,
    AGENCY_FEE: 350,
    PLATES_FEE: 50,
    ITP_RATE: 0.04, // Average 4% for private sales
};

export function calculateImportCosts(data: CarData): CostBreakdown {
    const { price, firstRegistrationDate, co2Emissions, isProfessionalSeller } = data;

    // 1. Determine Vehicle Age and Depreciation
    const now = new Date();
    const ageInYears = (now.getTime() - firstRegistrationDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    let depreciationFactor = 1.0;
    if (ageInYears <= 1) depreciationFactor = 1.0;
    else if (ageInYears <= 2) depreciationFactor = 0.84;
    else if (ageInYears <= 3) depreciationFactor = 0.67;
    else if (ageInYears <= 4) depreciationFactor = 0.56;
    else if (ageInYears <= 5) depreciationFactor = 0.47;
    else if (ageInYears <= 6) depreciationFactor = 0.39;
    else if (ageInYears <= 7) depreciationFactor = 0.34;
    else if (ageInYears <= 8) depreciationFactor = 0.28;
    else if (ageInYears <= 9) depreciationFactor = 0.24;
    else if (ageInYears <= 10) depreciationFactor = 0.19;
    else if (ageInYears <= 11) depreciationFactor = 0.17;
    else if (ageInYears <= 12) depreciationFactor = 0.13;
    else depreciationFactor = 0.10;

    // Estimate Taxable Base (Valor Fiscal)
    // Ideally, this comes from BOE tables. As a fallback, we use the Purchase Price as a proxy for the *current* market value.
    // However, the Tax is based on the *New Value* depreciated.
    // Since we don't know the New Value, we can try to infer it or just use the Current Price as the Taxable Base (Conservative).
    // A more realistic approach for a calculator without a DB: Assume the Purchase Price IS the Market Value.
    const taxableBase = price;

    // 2. Registration Tax (Impuesto de Matriculación)
    let registrationTaxRate = 0;
    if (co2Emissions <= 120) registrationTaxRate = 0;
    else if (co2Emissions < 160) registrationTaxRate = 0.0475;
    else if (co2Emissions < 200) registrationTaxRate = 0.0975;
    else registrationTaxRate = 0.1475;

    // The tax is applied to the Taxable Base (Depreciated Value)
    // NOTE: If the user inputs the *current* price, that IS the depreciated value roughly.
    // So we apply the rate to the current price.
    const registrationTax = taxableBase * registrationTaxRate;

    // 3. VAT (IVA) or ITP
    let vat = 0;
    let itp = 0;

    if (isProfessionalSeller) {
        // If buying from a dealer in Germany (Brutto price), VAT is included.
        // You do NOT pay Spanish VAT again unless it's a "New Means of Transport" (< 6 months OR < 6000 km).
        // We assume it's a used car (> 6 months) for this calculator default.
        // If it's Netto price, then VAT would be 21% of Netto.
        // For simplicity in this MVP, we assume the input price is the Final Price paid to the seller.
        // So Spanish VAT is 0.
        vat = 0;
    } else {
        // Private Seller: Pay ITP (Property Transfer Tax)
        itp = taxableBase * CONSTANTS.ITP_RATE;
    }

    // 4. Total
    const total = price + vat + registrationTax + itp + CONSTANTS.TRANSPORT_COST + CONSTANTS.ITV_FEE + CONSTANTS.TRAFFIC_FEE + CONSTANTS.AGENCY_FEE + CONSTANTS.PLATES_FEE;

    return {
        vehiclePrice: price,
        vat,
        registrationTax,
        importDuty: 0,
        transportCost: CONSTANTS.TRANSPORT_COST,
        itvFee: CONSTANTS.ITV_FEE,
        trafficFee: CONSTANTS.TRAFFIC_FEE,
        agencyFee: CONSTANTS.AGENCY_FEE,
        platesFee: CONSTANTS.PLATES_FEE,
        itp,
        total
    };
}
