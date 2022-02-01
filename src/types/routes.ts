// Landing page
export enum RouterHomePage {
    NAME = "Home",
    PATH = "/"
}
// ---




// Default dashboards
export enum RouterPrivatperson {
    NAME = "Privatperson",
    PATH = "/Dashboard/Privatperson"
}

export enum RouterArbeidsgiver {
    NAME = "Arbeidsgiver",
    PATH = "/Dashboard/Arbeidsgiver"
}

export enum RouterSamarbeidspartner {
    NAME = "Samarbeidspartner",
    PATH = "/Dashboard/Samarbeidspartner"
}

export enum RouterInternt {
    NAME = "Internt",
    PATH = "/Dashboard/Internt"
}
// ---



// Admin
export enum RouterAdmin {
    NAME = "Admin",
    PATH = "/Admin"
}

export enum RouterAdminDashboards {
    NAME = "Admin - Dashboards",
    PATH = "/Admin?tab=Dashbord"
}

export enum RouterAdminAddDashboard {
    NAME = "Admin - NewDashboard",
    PATH = "/Admin/NewDashbord"
}

export enum RouterAdminOmråder {
    NAME = "Admin - Områder",
    PATH = "/Admin?tab=Områder"
}

export enum RouterAdminAddOmråde {
    NAME = "Admin - Områder",
    PATH = "/Admin/NewOmraade"
}

export enum RouterAdminTjenester {
    NAME = "Admin - Tjenester",
    PATH = "/Admin?tab=Tjenester"
}

export enum RouterAdminAddTjeneste {
    NAME = "Admin - Tjenester",
    PATH = "/Admin/NewTjeneste"
}
// ---





// TjensteData
export enum RouterTjenestedata {
    NAME = "Admin - Tjenester",
    PATH = "/Tjenestedata/"
}
// ---





// Avvikshistorikk
export enum RouterAvvikshistorikk {
    NAME = "Avvikshistorikk",
    PATH = "/Avvikshistorikk"
}
// ---




// OpprettVarsling
export enum RouterOpprettVarsling {
    NAME = "Opprett Varsling",
    PATH = "/OpprettVarsling"
}

export enum RouterConfirmedCreation {
    NAME = "Profil opprettet",
    PATH = "/ProfilOpprettet"
}
// ---




// Login & Logout
export enum RouterLoginRoute {
    NAME = "Logg inn",
    PATH = "/Login"
}

export enum RouterLogoutRoute {
    NAME = "Logg ut",
    PATH = "/oauth2/logout"
}
// ---