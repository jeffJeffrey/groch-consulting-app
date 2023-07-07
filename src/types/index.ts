
export type Patient = {
    id: number | string
    name: string
    birthdate: Date
    address: string
    tel: string
    subscriptions: Subscription[]
    created_at?: string
}

export type Subscription = {
    id: number | string
    limitDate: string
    price: number
    patient?: Patient
    created_at?: string
}


export type Exam = {
    id: number | string
    name: string
    description: string
    price: number
    appliedCount: number
    created_at?: string
}


export type Consultation = {
    created_at?: string
    id: number | string
    patient?: Patient
    user?: User
    rightEye: string
    leftEye: string
    motif: string
    // entecedent General
    medicaux: string
    chirugicaux: string
    immunologique: string
    // entecedentOphtamologique
    gpao: boolean
    vc: boolean
    traumatisme: boolean
    // Lampe a fente
    paupieres: string
    iris: string
    cristallin: string
    conjonctive: string
    pupille: string
    cornee: string
    sclere: string
    // Fond d'oeuil
    retine: string
    macula: string
    vitree: string
    vaisseau: string
    prescriptions?: Prescription[]
    exams?: Exam[]
    diagnostic?: Diagnostic
    billed?: boolean
}

export type Prescription = {
    id?: string | number
    product_id: number | string;
    product?: Product
    quantity: number;
    note: string;
    eyeglasses?: string
}

export type Payment = {
    name: string
    price: number
    qunatity: number
    user_id: any
    type: "product" | "exam"
    patient_id: any
    user?: User
    patient?: Patient
    created_at?: string
}

export type MetricData = {
    totalSubscriptionPrice: number
    totalProductsBuyedPrice: number
    totalEntersPrice: number
    totalExamsBuyedPrice: number
    totalSpentsPrice: number
}

export type EyeglassesData = {
    sphereLeftEye: string
    sphereRightEye: string
    cylindreLeft: string
    cylindreRight: string
    axeRight: string
    axeLeft: string
    additionLeft: string
    additionRight: string
    photochromic: boolean
    antireflect: boolean
    blueProtect: boolean
    doubleFoyer: boolean
    progressif: boolean
    portConstant: boolean
    price: undefined | number
}

type Role = {
    id: string | number
    name: string
    display_name: string
}

export type User = {
    id: string | number
    username: string;
    name: string
    tel: string
    password?: string
    roles: Role[]
    created_at?: string
}
export type ProductsType = {
    id: number | string
    name: string
    description: string
    products?: Product[]
    created_at?: string
}

export type Diagnostic = Omit<ProductsType, "products"> & {
    consultations?: Consultation[]
}

export type Product = {
    id: number | string
    name: string
    description: string
    type: ProductsType
    price: number
    quantity: number
    buyPrice?: number
    created_at?: string
}

export type Spent = {
    id: number | string
    motif: string
    price: number
    additionalPrice: number
    products: Product[]
    created_at?: string
}

export type Enter = {
    id: number | string
    motif: string
    price: number
    additionalPrice: number
    patient: Patient[]
    created_at?: string
}


export type ThemeColor = "orange" | "slate" | "gray" | "zinc" | "neutral" | "stone" | "red" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | undefined
