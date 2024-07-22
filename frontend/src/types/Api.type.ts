export interface DataType {
    error?: string,
    message?: string
}

export interface StripeCancelData {
    message: string,
    ends_at: string,
}

export interface StripeResumeData {
    message: string,
    ends_at: string,
}