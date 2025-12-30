import { FileText, Users, Briefcase, Home, Building, Shield } from "lucide-react";

export const servicesData = [
  {
    // NOTARY_SERVICE
    id: 'notary-service',
    icon: FileText,
    title: "Notary Services",
    description: "Professional notarization of documents, affidavits, acknowledgments, and certified copies for legal validity.",
    detail: {
      subtitle: "Professional notarization of documents, affidavits, acknowledgments, and certified copies.",
      offers: [
        { title: "Document Notarization", desc: "Authentication of legal documents" },
        { title: "Affidavits & Oaths", desc: "Administration of sworn statements" },
        { title: "Certified Copies", desc: "Verification & certification of copies" },
        { title: "Mobile Notary Service", desc: "Notarization at your preferred location" },
        { title: "Real Estate Documents", desc: "Notarization of deeds and mortgages" },
        { title: "Power of Attorney", desc: "Legal authorization documents" }
      ],
      steps: [
        { title: "Schedule Appointment", desc: "Choose a convenient time" },
        { title: "Bring Valid ID", desc: "Government-issued photo ID required" },
        { title: "Sign Documents", desc: "Signed only in presence of notary" },
        { title: "Receive Documents", desc: "Get notarized copies immediately" }
      ],
      pricing: [
        { title: "Standard Notarization", price: "$15", note: "Per signature" },
        { title: "Mobile Service", price: "$75+", note: "Travel + per signature" },
        { title: "Certified Copies", price: "$10", note: "Per certification" }
      ]
    }
  },
  
  //CORPORATE LAW
  {
    id: 'corporate-law',
    icon: Briefcase,
    title: "Corporate Law",
    description: "Comprehensive legal solutions for businesses, including contracts, compliance, mergers, and corporate governance.",
    detail: {
      subtitle: "Full-service corporate law guidance to ensure your business is compliant and protected.",
      offers: [
        { title: "Contract Review & Drafting", desc: "Comprehensive contract management services" },
        { title: "Business Formation", desc: "LLC, Corporation, and Partnership setup" },
        { title: "Compliance Advisory", desc: "Ensuring regulatory compliance" },
        { title: "Mergers & Acquisitions", desc: "Legal support for business deals" },
        { title: "Corporate Governance", desc: "Board policies and corporate structure" },
        { title: "Employment Law", desc: "Employee contracts and dispute resolution" }
      ],
      steps: [
        { title: "Business Consultation", desc: "Assess your corporate legal needs" },
        { title: "Legal Strategy", desc: "Develop tailored business solutions" },
        { title: "Document Preparation", desc: "Draft and review all legal documents" },
        { title: "Ongoing Support", desc: "Continuous corporate legal guidance" }
      ],
      pricing: [
        { title: "Initial Consultation", price: "$150", note: "Per session" },
        { title: "Contract Services", price: "$500+", note: "Per contract" },
        { title: "Corporate Package", price: "$2500+", note: "Comprehensive business services" }
      ]
    }
  },
  
  //FAMILY LAW
  {
    id: 'family-law',
    icon: Home,
    title: "Family Law",
    description: "Sensitive handling of divorce, child custody, adoption, and other family-related legal matters.",
    detail: {
      subtitle: "Providing compassionate and professional legal support for family matters.",
      offers: [
        { title: "Divorce Proceedings", desc: "Complete divorce representation and mediation" },
        { title: "Child Custody & Support", desc: "Protecting children's best interests" },
        { title: "Adoption Services", desc: "Legal guidance through adoption process" },
        { title: "Spousal Support", desc: "Alimony and maintenance agreements" },
        { title: "Property Division", desc: "Equitable distribution of marital assets" },
        { title: "Prenuptial Agreements", desc: "Marriage contract preparation" }
      ],
      steps: [
        { title: "Confidential Consultation", desc: "Discuss your family situation privately" },
        { title: "Case Assessment", desc: "Evaluate legal options and strategies" },
        { title: "Legal Representation", desc: "Court advocacy and negotiation" },
        { title: "Resolution & Support", desc: "Achieve favorable outcomes with ongoing guidance" }
      ],
      pricing: [
        { title: "Initial Consultation", price: "$100", note: "Confidential session" },
        { title: "Uncontested Divorce", price: "$1500+", note: "Complete filing services" },
        { title: "Full Representation", price: "$3000+", note: "Complex family law cases" }
      ]
    }
  },
  
  //REAL ESTATE LAW
  {
    id: 'real-estate-law',
    icon: Building,
    title: "Real Estate Law",
    description: "Expert guidance on property transactions, disputes, zoning issues, and real estate contracts.",
    detail: {
      subtitle: "Comprehensive real estate legal services for buyers, sellers, and investors.",
      offers: [
        { title: "Property Transactions", desc: "Purchase and sale agreement review" },
        { title: "Title Examination", desc: "Ensure clear property ownership" },
        { title: "Lease Agreements", desc: "Residential and commercial lease drafting" },
        { title: "Property Disputes", desc: "Boundary and easement conflict resolution" },
        { title: "Zoning & Land Use", desc: "Compliance with local regulations" },
        { title: "Foreclosure Defense", desc: "Protect your property rights" }
      ],
      steps: [
        { title: "Property Consultation", desc: "Review transaction details and concerns" },
        { title: "Due Diligence", desc: "Comprehensive property research" },
        { title: "Document Preparation", desc: "Draft and review all real estate documents" },
        { title: "Closing Support", desc: "Smooth transaction completion" }
      ],
      pricing: [
        { title: "Document Review", price: "$200", note: "Per property transaction" },
        { title: "Title Search", price: "$300+", note: "Complete title examination" },
        { title: "Full Transaction Package", price: "$1500+", note: "End-to-end legal support" }
      ]
    }
  },
  
  //CRIMINAL DEFENSE
  {
    id: 'criminal-defense',
    icon: Shield,
    title: "Criminal Defense",
    description: "Aggressive defense representation for various criminal charges with a focus on protecting your rights.",
    detail: {
      subtitle: "Experienced defense attorneys protecting your rights in criminal cases.",
      offers: [
        { title: "DUI/DWI Defense", desc: "Expert representation for impaired driving charges" },
        { title: "Drug Offense Defense", desc: "Possession and trafficking charge defense" },
        { title: "Assault & Battery", desc: "Defense for violent crime accusations" },
        { title: "Theft & Fraud", desc: "White-collar and property crime defense" },
        { title: "Domestic Violence", desc: "Sensitive handling of domestic charges" },
        { title: "Expungement Services", desc: "Clear eligible criminal records" }
      ],
      steps: [
        { title: "Free Consultation", desc: "Confidential case review with attorney" },
        { title: "Evidence Investigation", desc: "Thorough analysis of prosecution's case" },
        { title: "Defense Strategy", desc: "Build strong legal defense approach" },
        { title: "Court Representation", desc: "Aggressive advocacy at trial" }
      ],
      pricing: [
        { title: "Initial Consultation", price: "FREE", note: "Complimentary case evaluation" },
        { title: "Misdemeanor Defense", price: "$2500+", note: "Starting rate for misdemeanors" },
        { title: "Felony Defense", price: "$5000+", note: "Complex criminal cases" }
      ]
    }
  },
  
  //ESTATE PLANNING
  {
    id: 'estate-planning',
    icon: FileText,
    title: "Estate Planning",
    description: "Strategic planning for wills, trusts, probate, and estate administration to secure your legacy.",
    detail: {
      subtitle: "Protect your assets and ensure your wishes are honored with comprehensive estate planning.",
      offers: [
        { title: "Will Preparation", desc: "Custom wills tailored to your wishes" },
        { title: "Trust Creation", desc: "Living trusts and testamentary trusts" },
        { title: "Probate Administration", desc: "Efficient estate settlement process" },
        { title: "Power of Attorney", desc: "Healthcare and financial directives" },
        { title: "Asset Protection", desc: "Strategies to preserve wealth" },
        { title: "Estate Tax Planning", desc: "Minimize tax liability for beneficiaries" }
      ],
      steps: [
        { title: "Estate Consultation", desc: "Review your assets and family situation" },
        { title: "Custom Planning", desc: "Develop personalized estate strategy" },
        { title: "Document Drafting", desc: "Prepare all necessary legal documents" },
        { title: "Review & Updates", desc: "Periodic review and modifications" }
      ],
      pricing: [
        { title: "Simple Will", price: "$400", note: "Basic will preparation" },
        { title: "Living Trust Package", price: "$1500+", note: "Complete trust setup" },
        { title: "Comprehensive Estate Plan", price: "$3000+", note: "Full estate planning services" }
      ]
    }
  },
  
  //CIVIL LITIGATION
  {
    id: 'civil-litigation',
    icon: Users,
    title: "Civil Litigation",
    description: "Skilled advocacy in civil disputes, including personal injury, contract disputes, and business litigation.",
    detail: {
      subtitle: "Expert representation in civil court for disputes requiring legal resolution.",
      offers: [
        { title: "Personal Injury Claims", desc: "Accident and injury compensation cases" },
        { title: "Contract Disputes", desc: "Breach of contract litigation" },
        { title: "Business Litigation", desc: "Commercial dispute resolution" },
        { title: "Property Disputes", desc: "Real estate conflict litigation" },
        { title: "Employment Disputes", desc: "Wrongful termination and discrimination" },
        { title: "Debt Collection Defense", desc: "Protect against creditor lawsuits" }
      ],
      steps: [
        { title: "Case Evaluation", desc: "Assess the merits of your claim" },
        { title: "Pre-Trial Preparation", desc: "Discovery and evidence gathering" },
        { title: "Settlement Negotiation", desc: "Attempt favorable out-of-court resolution" },
        { title: "Trial Representation", desc: "Aggressive courtroom advocacy" }
      ],
      pricing: [
        { title: "Consultation", price: "$150", note: "Initial case review" },
        { title: "Hourly Rate", price: "$300", note: "Per hour of legal work" },
        { title: "Contingency Fee", price: "30-40%", note: "Percentage of recovery (injury cases)" }
      ]
    }
  }
];