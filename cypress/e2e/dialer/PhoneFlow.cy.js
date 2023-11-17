/// <reference types="cypress" />

const DIALER_SELECTORS = {
    BRAND: "dialer_brand_selector",
    BRAND_INPUT: "dialer_brand_textfield_input",
    BRAND_OPTION: "brand_option_46",
    ZIP: "dialer_zip_code",
    ZIP_INPUT: "dialer_zip_code_input",
    CALLER_ID: "dialer_caller_id",
    CALLER_ID_INPUT: "dialer_caller_id_input",
    PROCEED: "dialer_proceed",
    VERIFY_PAGE: "dialer_verify_caller_detail"
}

describe("Phone flow suit", () => {

    beforeEach(function () {
        const rt = Cypress.env('RT')
        const domain = Cypress.env('BACKEND_URL')
        cy.setCookie("rt", rt, { domain: domain, httpOnly: false, secure: true, sameSite: "no_restriction" })
    })

    it("IBSN-TC-36 : verify the Home page URL working fine when customer dialed to active channel id and enter the valid zip code through IVR", () => {
        const media = "PHONE"
        const zipCode = "80222"
        const channelId = "+14232263241"
        const homeURLChannelId = parseInt(channelId.substring(2), 10);
        const callerId = "6506698823"
        const channelName = "360%20codimite%20channel%20test"
        const subject = ""
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`)
        cy.url().should('eq', `${Cypress.config().baseUrl}/home?media=${media}&brand_id=10&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${homeURLChannelId}&channel_name=${channelName}&job_id=&subject=${subject}&from=${callerId}`+'&interaction_guid=');
    })

    it("IBSN-TC-35 : verify the URL and Appropraite warning displayes for a call scenario while customer dialed for active channel id but channel id inactive/deleted/Not still update in middleware", () => {
        const media = "PHONE"
        const zipCode = "80222"
        const channelId = "5425896547"
        const callerId = "6506698823"
        const channelName = "360%20codimite%20channel%20test"
        const subject = ""
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`)
        cy.getBySel("notification_text").then((x) => {
            let expected = "The Channel ID-5425896547 doesn’t exist in the Middleware";
            const actualValue = x.text();
            assert.equal(actualValue, expected)
        })
    })

    it("IBSN-TC-34 : verify the customer caller details page working process while customer call to active franchise but not entering zip code through IVR/ Whout required filed can't go to home page", () => {
        const media = "PHONE"
        const zipCode = ""
        const channelId = "4232263241"
        const callerId = "6506698823"
        const channelName = "360%20codimite%20channel%20test"
        const subject = ""
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`)
        cy.getBySelLike(DIALER_SELECTORS.VERIFY_PAGE).should('have.text', 'Customer Details')
        cy.url().should('eq', `${Cypress.config().baseUrl}/dialer${search}`)
    })


})