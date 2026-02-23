// Landing page
export enum RouterHomePage {
    NAME = "Home",
    PATH = "/",
}
// ---

// Default dashboards
export enum RouterPrivatperson {
    NAME = "Privatperson",
    PATH = "/dashboard/privatperson",
}

export enum RouterArbeidsgiver {
    NAME = "Arbeidsgiver",
    PATH = "/dashboard/arbeidsgiver",
}

export enum RouterSamarbeidspartner {
    NAME = "Samarbeidspartner",
    PATH = "/dashboard/samarbeidspartner",
}

export enum RouterInternt {
    NAME = "Internt",
    PATH = "/dashboard/internt",
}

// Routes for external/internal access
export enum RouterSPSamarbeidspartner {
    NAME = "Samarbeidspartner",
    PATH = "/samarbeidspartner",
}

export enum RouterSPInternt {
    NAME = "Internt",
    PATH = "/internt",
}
// ---

// Admin
export enum RouterAdmin {
    NAME = "Admin",
    PATH = "/admin?tab=Tjenester",
}

export enum RouterAdminDashboards {
    NAME = "Admin - Dashboards",
    PATH = "/admin?tab=Dashbord",
}

export enum RouterAdminAddDashboard {
    NAME = "Admin - NewDashboard",
    PATH = "/admin/nyttdashbord",
}

export enum RouterAdminOmråder {
    NAME = "Admin - Områder",
    PATH = "/admin?tab=Områder",
}

export enum RouterAdminAddOmråde {
    NAME = "Admin - Områder",
    PATH = "/admin/nyttomraade",
}

export enum RouterAdminTjenester {
    NAME = "Admin - Tjenester",
    PATH = "/admin?tab=Tjenester",
}

export enum RouterAdminAddTjeneste {
    NAME = "Admin - Tjenester",
    PATH = "/admin/nytjeneste",
}

export enum RouterAdminKomponenter {
    NAME = "Admin - Komponenter",
    PATH = "/admin?tab=Komponenter",
}

export enum RouterAdminAddKomponent {
    NAME = "Admin - Komponenter",
    PATH = "/admin/nykomponent",
}
// ---

// TjensteData
export enum RouterTjenestedata {
    NAME = "Admin - Tjenester",
    PATH = "/tjenestedata/",
}
// ---

// Avvikshistorikk
export enum RouterAvvikshistorikk {
    NAME = "Avvikshistorikk",
    PATH = "/avvikshistorikk",
}
// ---

// OPSMeldinger
export enum RouterOpsMeldinger {
    NAME = "Driftsmeldinger",
    PATH = "/driftsmeldinger",
}

export enum RouterOpprettOpsMelding {
    NAME = "Opprett driftsmelding",
    PATH = "driftsmeldinger/opprettmelding",
}
// ---

// OpprettVarsling
export enum RouterOpprettVarsling {
    NAME = "Opprett Varsling",
    PATH = "/opprettvarsling",
}

export enum RouterConfirmedCreation {
    NAME = "Profil opprettet",
    PATH = "/profilopprettet",
}
// ---

// Login & Logout
export enum RouterLogin {
    NAME = "Logg inn",
    PATH = "/login",
}

export enum RouterOauthLogin {
    NAME = "LoginAzure",
    //  PATH = "/authenticate/login"
    PATH = "/oauth2/login?redirect=" + "/",
}

export enum RouterLogout {
    NAME = "Logg ut",
    PATH = "/oauth2/logout",
}
// ---

// Error
export enum RouterError {
    NAME = "Error side",
    PATH = "/Custom404",
}
// ---

// Feedback form
export enum RouterFeedbackForm {
    NAME = "Feedback skjema",
    PATH = "/feedbackskjema",
}
// ---

// UU status
export enum RouterUUStatus {
    NAME = "Status Universell Utforming",
    PATH = "/uustatus/tjeneste",
}
// ---

// Vaktor
//NB - External URL, uses full domain
export enum RouterVaktor {
    NAME = "Vaktor",
    PATH = "https://vaktor.ansatt.nav.no/",
}
// ---
