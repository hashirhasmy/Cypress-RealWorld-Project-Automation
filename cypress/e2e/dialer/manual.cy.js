import DiallerPage from "../../PageObjects/DiallerPage"
import CallLogsPage from "../../PageObjects/callLogsPage"
import HomePage from "../../PageObjects/homePage"
import properties from "../../fixtures/properties.json"


const DIALER_SELECTORS = {
    BRAND: "dialer_brand_selector",
    BRAND_OPTION: "brand_option_46",
    ZIP: "dialer_zip_code",
    CALLER_ID: "dialer_caller_id",
    PROCEED: "split_button",
    APPLICATION_PANEL: "dialer_application_pannel"
}

const NAVBAR_ICONS = {
    HOME_ICON: "HomeIcon"
}

describe("Manual Dialer page", () => {
    beforeEach(function () {
        const rt = Cypress.env('RT')
        const domain = Cypress.env('BACKEND_URL')
        cy.setCookie("rt", rt, { domain: domain, httpOnly: false, secure: true, sameSite: "no_restriction" })
    })

    it('should popup middleware for logout agents without any issues', () => {
        let requestBody = {
            'TransactionId': '12345',
            'Channel': '1234567890',
            'Media': 'Email',
            'Subject': 'Test Subject',
            'ANI': '1234567890',
            'UserDataXml': '<xml></xml>'
        }
        cy.setCookie("rt", "")
        cy.request({
            method: 'POST',
            url: Cypress.env("BACKEND_URL") + '/data/eight-by-eight/screen-popup',
            form: true,
            body: requestBody
        }).then((response) => {
            expect(response.status).to.equal(200);
        });
    });

    it('Verify agent redirects to login page when user is not authenticated to Middleware', () => {
        // cy.clearAllCookies()
        // cy.visit('/dialer')
        // cy.location("pathname").should("eq", "/");

        const homePage = new HomePage();
        cy.loginApp(properties.zipCode, properties.callerId)
        homePage.click_Application_panal()
        cy.reload()
        cy.get(".top-bar>.top-bar-right>div>div:last-child").click()
        cy.get(".profile-box>button").click()
        cy.get("h1").should('be.visible')
        cy.wait(5000)
        cy.clearAllCookies()
        cy.visit('/call-logs')
        cy.wait(2000)
        cy.url().should("eq", Cypress.config().baseUrl+"/")

    })

    it('fills required data and proceed to home', () => {
        cy.visit('/dialer')
        cy.getBySel(DIALER_SELECTORS.BRAND).click()
        cy.getBySel(DIALER_SELECTORS.BRAND_OPTION).click()
        cy.getBySel(DIALER_SELECTORS.ZIP).type("80222")
        cy.getBySel(DIALER_SELECTORS.CALLER_ID).type("2234567890")
        cy.getBySel(DIALER_SELECTORS.PROCEED).click()
        cy.location("pathname").should("eq", "/home");
    })

    it('shows brand required when not brand not filled', () => {
        cy.visit('/dialer')
        cy.getBySel(DIALER_SELECTORS.ZIP).type("80222")
        cy.getBySel(DIALER_SELECTORS.CALLER_ID).type("2234567890")
        cy.getBySel(DIALER_SELECTORS.PROCEED).click()
        cy.location("pathname").should("eq", "/dialer");
        cy.focused().then(($input) => {
            expect($input[0].validationMessage).to.contain('Please fill')
        })
    })

    it('shows zip cod required when zip code not filled', () => {
        cy.visit('/dialer')
        cy.getBySel(DIALER_SELECTORS.BRAND).click()
        cy.getBySel(DIALER_SELECTORS.BRAND_OPTION).click()
        cy.getBySel(DIALER_SELECTORS.CALLER_ID).type("2234567890")
        cy.getBySel(DIALER_SELECTORS.PROCEED).click()
        cy.location("pathname").should("eq", "/dialer");
        cy.focused().then(($input) => {
            expect($input[0].validationMessage).to.contain('Please fill')
        })
    })

    it('proceeed to home even though caller id is not filled', () => {
        cy.visit('/dialer')
        cy.getBySel(DIALER_SELECTORS.BRAND).click()
        cy.getBySel(DIALER_SELECTORS.BRAND_OPTION).click()
        cy.getBySel(DIALER_SELECTORS.ZIP).type("80222")
        cy.getBySel(DIALER_SELECTORS.PROCEED).click()
        cy.location("pathname").should("eq", "/home");
    })

    it('proceeed to application panned when clicked on application pannel button', () => {
        cy.visit('/dialer')
        cy.getBySel("dialer_application_pannel").click()
        cy.location("pathname").should("eq", "/call-logs");
    })

    it('verify if not proceed the caller detail page form dialer page should load previously poped data when comming back to manual dialer page', () => {
        const media = "EMAIL"
        const zipCode = "80222"
        const channelId = "1234567890"
        const callerId = "1234567899"
        const channelName = "TestChannel"
        const subject = "TestSubject"
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`)
        cy.getBySel("dialer_application_pannel").click()
        cy.getBySel("topbar_manual_job").click()
        cy.location("search").should("eq", search + '&interaction_guid=');
    })

    it('Verify previously stored home page details not get isolating untill we proceed with new detail throught caller detail page', () => {
        const media = "PHONE"
        const zipCode = "80222"
        const zipCode1 = "55"
        const channelId = "4232263241"
        const callerId = "6506698823"
        const channelName = "360%20codimite%20channel%20test"
        const subject = ""
        const search = `?media=${media}&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        const search1 = `?media=${media}&zip_code=${zipCode1}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&subject=${subject}`
        cy.visit(`/dialer${search}`).then(() => {
            cy.url().should('eq', `${Cypress.config().baseUrl}/home?media=${media}&brand_id=10&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&job_id=&subject=${subject}&from=${callerId}` + '&interaction_guid=');
        })
        cy.visit(`/dialer${search1}`).then(() => {
            cy.getBySel(DIALER_SELECTORS.APPLICATION_PANEL).click({ force: true });
            cy.wait(2000)
            cy.get("[data-testid='HomeIcon']").click({ force: true });
            cy.wait(2000)
            cy.url().should('eq', `${Cypress.config().baseUrl}/home?media=${media}&brand_id=10&zip_code=${zipCode}&caller_id=${callerId}&channel_id=${channelId}&channel_name=${channelName}&job_id=&subject=&from=${callerId}` + '&interaction_guid=');
        })
    })


})