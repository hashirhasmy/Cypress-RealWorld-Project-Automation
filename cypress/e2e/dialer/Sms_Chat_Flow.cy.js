/// <reference types="cypress" />

const DIALER_SELECTORS = {
    BRAND: "dialer_brand_selector",
    BRAND_OPTION: "brand_option_46",
    ZIP: "dialer_zip_code",
    CALLER_ID: "dialer_caller_id",
    PROCEED: "split_button",
    APPLICATION_PANEL: "dialer_application_pannel"
}

describe("Sms chat flow suit", () => {

    beforeEach(function () {
        const rt = Cypress.env('RT')
        const domain = Cypress.env('BACKEND_URL')
        cy.setCookie("rt", rt, { domain: domain, httpOnly: false, secure: true, sameSite: "no_restriction" })
    })

    it("IBSN-TC-48 : Verify that when agent accept SMS  Request should popup middle ware window and able to proceed without any issues", () => {
        const media = "CHAT"
        const zipCode = ""
        const channelId = "45337"
        const callerId = "+14342182906"
        const homeURLcallerId = parseInt(callerId.substring(2), 10);
        const channelName = "sms%20test%20channel%20codimite"
        const subject = ""
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`)
        cy.location("search").should("eq", search);
        cy.getBySel(DIALER_SELECTORS.BRAND).click()
        cy.getBySel(DIALER_SELECTORS.BRAND_OPTION).click()
        cy.wait(2000)
        cy.getBySel(DIALER_SELECTORS.ZIP).type("80222")
        cy.getBySel(DIALER_SELECTORS.PROCEED).click();
        cy.url().should('eq', `${Cypress.config().baseUrl}/home?media=${media}&brand_id=10&zip_code=80222&caller_id=${homeURLcallerId}&channel_id=${channelId}&channel_name=${channelName}&job_id=&subject=${subject}&from=${homeURLcallerId}`+'&interaction_guid=')
    })

    it("IBSN-TC-54 : Verify that when agent accept CHAT  Request should popup middle ware window and able to proceed without any issues", () => {
        const media = "CHAT"
        const zipCode = ""
        const channelId = "360%20Channel"
        const callerId = "test@gmail.com"
        const channelName = "360%20Channel"
        const subject = ""
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`)
        cy.location("search").should("eq", search);
        cy.getBySel(DIALER_SELECTORS.BRAND).click()
        cy.getBySel(DIALER_SELECTORS.BRAND_OPTION).click()
        cy.wait(2000)
        cy.getBySel(DIALER_SELECTORS.ZIP).type("80222")
        cy.getBySel(DIALER_SELECTORS.PROCEED).click();
        cy.url().should('eq', `${Cypress.config().baseUrl}/home?media=${media}&brand_id=10&zip_code=80222&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&job_id=&subject=${subject}&from=${callerId}`+'&interaction_guid=')
    })
})