/// <reference types="cypress" />
const DIALER_SELECTORS = {
    BRAND: "dialer_brand_selector",
    BRAND_INPUT: "dialer_brand_textfield_input",
    BRAND_OPTION: "brand_option_46",
    ZIP: "dialer_zip_code",
    ZIP_INPUT: "dialer_zip_code_input",
    ZIP_INPUT1: "input[type='search']",
    CALLER_ID: "dialer_caller_id",
    CALLER_ID_INPUT: "dialer_caller_id_input",
    CALLER_ID_INPUT1: "input[placeholder='test@test.com or 1234567890']",
    PROCEED: "dialer_proceed"
}

const RIGHT_DOCK_SELECTORS = {
    SIDE_PANEL: "right-dock-side-panel",
    EMAIL: "emails",
    PHONE: "phone"
}

const EMAILCLIENT_SELECTORS = {
    SIDE_PANEL_BRAND_INPUT: "email_client_brand_textfield_input",
    SIDE_PANEL_BRAND_EMAIL_INPUT: "email_client_brand_email_textfield_input"
}

describe("Email flow suit", () => {

    beforeEach(function () {
        const rt = Cypress.env('RT')
        const domain = Cypress.env('BACKEND_URL')
        cy.setCookie("rt", rt, { domain: domain, httpOnly: false, secure: true, sameSite: "no_restriction" })
    })

    it("IBSN-TC-60 : Verify the filelds get fills in caller detail page that when agent accept email that not already exist in middleware", () => {
        const media = "EMAIL"
        const zipCode = "80222"
        const channelId = "service@360paintings.com"
        const callerId = "sachini.nandasena@codimite.com"
        const channelName = "360%20Email"
        const subject = "TestSubject"
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`)
        cy.getBySel(DIALER_SELECTORS.BRAND_INPUT).should("have.value", "")
        cy.get(DIALER_SELECTORS.ZIP_INPUT1).should('have.value', '80222')
        cy.get(DIALER_SELECTORS.CALLER_ID_INPUT1).should('have.value', 'sachini.nandasena@codimite.com')
    })

    it("IBSN-TC-60-1 : Verify the caller detail page filelds get fills middleware poped up if accept the email already exist in middleware", () => {
        //for this test case mandotory add psb.development@codimite.com email to 360 Brand
        const media = "EMAIL"
        const zipCode = ""
        const channelId = "psb.development@codimite.com"
        const callerId = "sachini.nandasena@codimite.com"
        const channelName = "360%20Email"
        const subject = "TestSubject"
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`)
        cy.getBySel(DIALER_SELECTORS.BRAND_INPUT).should('have.value', '360 Painting')
        cy.get(DIALER_SELECTORS.ZIP_INPUT1).should('have.value', '')
        cy.get(DIALER_SELECTORS.CALLER_ID_INPUT1).should('have.value', 'sachini.nandasena@codimite.com')
    })

    it("IBSN-TC-60-2 : Verify the side panel to ensure middleware popped up for proper email, it related brand automatically picked in side panal email section", () => {
        //for this test case mandotory add psb.development@codimite.com email to 360 Brand
        const media = "EMAIL"
        const zipCode = ""
        const channelId = "psb.development@codimite.com"
        const callerId = "sachini.nandasena@codimite.com"
        const channelName = "360%20Email"
        const subject = "TestSubject"
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`)
        cy.getBySel(RIGHT_DOCK_SELECTORS.SIDE_PANEL).click({ force: true })
        cy.getBySel(RIGHT_DOCK_SELECTORS.EMAIL).click({ force: true })
        cy.getBySel(EMAILCLIENT_SELECTORS.SIDE_PANEL_BRAND_INPUT).should('have.value', '360 Painting')
        cy.getBySel(EMAILCLIENT_SELECTORS.SIDE_PANEL_BRAND_EMAIL_INPUT).should('have.value', 'psb.development@codimite.com')
        cy.get(DIALER_SELECTORS.ZIP_INPUT1).should('have.value', '')
        cy.get(DIALER_SELECTORS.CALLER_ID_INPUT1).should('have.value', 'sachini.nandasena@codimite.com')
    })

    it("IBSN-TC-60-3 : Verify the side panel to ensure middleware popped up for middleware don't having email, email and brand dropdown isn't filled automatically", () => {
        const media = "EMAIL"
        const zipCode = "55555"
        const channelId = "service@360paintings.com"
        const callerId = "sachini.nandasena@codimite.com"
        const channelName = "360%20Email"
        const subject = "TestSubject"
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`)
        cy.getBySel(RIGHT_DOCK_SELECTORS.SIDE_PANEL).click({ force: true })
        cy.getBySel(RIGHT_DOCK_SELECTORS.EMAIL).click({ force: true })
        cy.getBySel(EMAILCLIENT_SELECTORS.SIDE_PANEL_BRAND_INPUT).should('have.value', '')
        cy.getBySel(EMAILCLIENT_SELECTORS.SIDE_PANEL_BRAND_EMAIL_INPUT).should('have.value', '')
        cy.get(DIALER_SELECTORS.ZIP_INPUT1).should('have.value', '55555')
        cy.get(DIALER_SELECTORS.CALLER_ID_INPUT1).should('have.value', 'sachini.nandasena@codimite.com')
    })

    it("Verify proceed with email flow to confirm redirecting to Relevent page with expected URL", () => {
        //for this test case mandotory add psb.development@codimite.com email to 360 Brand
        const media = "EMAIL"
        const zipCode = "33880"
        const channelId = "psb.development@codimite.com"
        const callerId = "sachini.nandasena@codimite.com"
        const channelName = "360%20Email"
        const subject = "TestSubject"
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`)
        cy.url().should('eq', `${Cypress.config().baseUrl}/home?media=${media}&brand_id=10&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&job_id=&subject=${subject}&from=${callerId}`);
    })


})