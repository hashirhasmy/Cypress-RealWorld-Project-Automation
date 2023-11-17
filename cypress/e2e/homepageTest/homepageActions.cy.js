/// <reference types="cypress" />

const HOMEPAGE_SELECTORS = {
    AUTOPICK_INCORRECT_ZIP_ERROR_MESSAGE: "franchise_select_view_no_auto_pick_franchises",
    AUTOPICK_FRANCHISE_NAME: "div[class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-4 css-1udb513'] p",
    VERIFY_SERCH_FOR_DIFFERENT_FRANCHISE_FIRST_SELECT_BUTTON: "franchise_select_view_next_near_by_franchises_0",
    ST_FRACHISE_SELECT_BUTTON: "franchise_select_view_default_0",
    JOB_SUBMITTED_SUCCESS_MESSAGE: "notification_text",
    FRANCHISE_SELECT_VIEW_ZIP_CODE_SEARCH_INPUT: "franchise_select_view_zip_code_search_input",
    FRANCHISE_SELECT_VIEW_ZIP_CODE_0: "franchise_select_view_zip_code_0",
    FRANCHISE_SELECT_VIEW_NO_ZIP_CODE_FRANCHISES: "franchise_select_view_no_zip_code_franchises",
    FRANCHISE_SELECT_VIEW_GO_TO_MAP: "franchise_select_view_go_to_map",
    CALLER_DETAILS_HOLD_THE_JOB: "caller_details_hold_the_job",
    CALLER_DETAILS_HOLD_JOB_SUBMIT_DIALOG_YES: "caller_details_hold_job_submit_dialog_yes",
    CALLER_DETAILS_HOLD_JOB_SUBMIT_DIALOG_NO: "caller_details_hold_job_submit_dialog_no",
    FRANCHISE_SELECT_NO_NEAR_BY_LOCATIONS: "franchise_select_no_near_by_locations",
    MAP_VIEW_ZIP_CODE_SEARCH_BUTTON: "map_view_zip_code_search_button",
    MAP_VIEW_ZIP_CODE_INPUT: "map_view_zip_code_input",
    MAP_VIEW_DIALOG_HEADER: "map_view_dialog_header"
}

const CONFIRM_SUBMISSION_POP_UP_SELECTORS = {
    CALLER_ID: "submit_dialog_caller_id",
    FRANCHISE_NAME: "submit_dialog_franchise_name",
    ZIPCODE: "submit_dialog_zip_code",
    CREATE_JOB_WITHIN_MIDDLEWARE_BUTTON: "submit_dialog_create_job_within_middleware_button",
    SUBMIT_DIALOG_CREATE_JOB_BUTTON: "submit_dialog_create_job_button",
    SUBMIT_DIALOG_CREATE_LEAD_BUTTON: "submit_dialog_create_a_lead_button",
    SUBMIT_DIALOG_CANCEL_BUTTON: "submit_dialog_cancel_button"
}

const HOMEURL = {
    media: "MANUAL",
    BRANDID: "10",
    zipCode: "33880",
    channelId: "",
    callerId: "5555556897",
    channelName: "",
    subject: "",
}
const HOME_COMMON_URL = `?media=${HOMEURL.media}&brand_id=${HOMEURL.BRANDID}&zip_code=${HOMEURL.zipCode}&caller_id=${HOMEURL.callerId}&channel_id=${HOMEURL.channelId}&channel_name=${HOMEURL.channelName}&job_id=&subject=${HOMEURL.subject}&from=`

beforeEach(function () {
    const rt = Cypress.env('RT')
    const domain = Cypress.env('BACKEND_URL')
    cy.setCookie("rt", rt, { domain: domain, httpOnly: false, secure: true, sameSite: "no_restriction" })
})

describe("Home Page ACTIONS test flows", () => {

    const testData = [
        { media: 'MANUAL', callerID: '5555556897' },
        { media: 'EMAIL', callerID: 'sachini.nandasena@codimite.com' }
    ];

    testData.forEach((data) => {
        it(`Test with media: ${data.media} and callerID: ${data.callerID} | IBSN-TC-26 : After clicking the select button, verify that the 'Create job within middleware' button located in the confirmation submission popup is working properly.`, () => {
            cy.visit(`${Cypress.config().baseUrl}/home?media=${data.media}&brand_id=${HOMEURL.BRANDID}&zip_code=${HOMEURL.zipCode}&caller_id=${data.callerID}&channel_id=${HOMEURL.channelId}&channel_name=${HOMEURL.channelName}&job_id=&subject=${HOMEURL.subject}&from=`)
            cy.getBySel(HOMEPAGE_SELECTORS.VERIFY_SERCH_FOR_DIFFERENT_FRANCHISE_FIRST_SELECT_BUTTON, { timeout: 10000 }).click();
            cy.get("table>tbody>tr:first-child>td:nth-child(2)").then((x) => {
                let selected_franchise_name = x.text()
                cy.getBySel(CONFIRM_SUBMISSION_POP_UP_SELECTORS.CALLER_ID).should('have.text', data.callerID)
                cy.getBySel(CONFIRM_SUBMISSION_POP_UP_SELECTORS.FRANCHISE_NAME).should('have.text', selected_franchise_name)
                cy.getBySel(CONFIRM_SUBMISSION_POP_UP_SELECTORS.ZIPCODE).should('have.text', '33880')
            })
        });
    });

    it("IBSN-TC-26-1 After clicking the select button, verify that the while click 'Create job within middleware submit button should redirecting create new job modal", () => {

        cy.visit(`${Cypress.config().baseUrl}/home${HOME_COMMON_URL}`)
        /*
        cy.request('GET', 'https://be.dev.insightbusinesssolutions.app/data/franchises').then((response) => {
            // Assuming the response contains an array of franchises
            const franchises = response.body;
            // Assuming you want to use the first franchise's ID
            let franchiseId = franchises[238].id;
            // You can also perform any assertions here if needed
            expect(franchiseId).to.exist; // Assert that franchiseId is not empty
            cy.getBySel(HOMEPAGE_SELECTORS.VERIFY_SERCH_FOR_DIFFERENT_FRANCHISE_FIRST_SELECT_BUTTON, { timeout: 10000 }).click();
            cy.getBySel(CONFIRM_SUBMISSION_POP_UP_SELECTORS.CREATE_JOB_WITHIN_MIDDLEWARE_BUTTON).click();
            cy.url().should('eq', `${Cypress.config().baseUrl}/jobs?isNew=true&brandId=${HOMEURL.BRANDID}&franchiseId=${franchiseId}&callerId=${HOMEURL.callerId}&zipCode=${HOMEURL.zipCode}`)
            cy.getBySel("notification_text").should('have.text', 'Job details have been successfully submitted')
        });
        */
        cy.getBySel(HOMEPAGE_SELECTORS.ST_FRACHISE_SELECT_BUTTON, { timeout: 10000 }).click();
        cy.getBySel(CONFIRM_SUBMISSION_POP_UP_SELECTORS.CREATE_JOB_WITHIN_MIDDLEWARE_BUTTON).click();
        cy.url().should('eq', `${Cypress.config().baseUrl}/jobs?isNew=true&brandId=${HOMEURL.BRANDID}&franchiseId=1350&callerId=${HOMEURL.callerId}&zipCode=${HOMEURL.zipCode}`)
        cy.getBySel(HOMEPAGE_SELECTORS.JOB_SUBMITTED_SUCCESS_MESSAGE).should('have.text', 'Job details have been successfully submitted')
    })

    //TODO need to discuss with lakmal
    it.skip("IBSN-TC-25-1 : After clicking the select button, verify that the 'Create a job' button located in the confirmation submission popup is working correctly and redirecting to Vonigo CRM.", () => {
        cy.visit(`${Cypress.config().baseUrl}/home${HOME_COMMON_URL}`)
        cy.getBySel(HOMEPAGE_SELECTORS.VERIFY_SERCH_FOR_DIFFERENT_FRANCHISE_FIRST_SELECT_BUTTON, { timeout: 10000 }).click();
        cy.getBySel(CONFIRM_SUBMISSION_POP_UP_SELECTORS.SUBMIT_DIALOG_CREATE_JOB_BUTTON).click();
        cy.url().should('eq', `https://psb.vonigo.com/api/telco/?provider=eightbyeight&franchiseID=1193&serviceTypeID=10&ani=&dnis=&zip=${HOMEURL.zipCode}`)
    })

    //TODO need to discuss with lakmal
    it.skip("IBSN-TC-25-2 : After clicking the select button, verify that the 'Create a job' button located in the confirmation submission popup is working correctly and redirect to ST-CRM.", () => {
        //here having a issue it's redirecteting to call logs page after click on the create job button
        let IBSN_TC_25_2_brand_id = "23";
        let IBSN_TC_25_2_zip_code = "80222"
        const IBSN_TC_25_2_URL = `?media=${HOMEURL.media}&brand_id=${IBSN_TC_25_2_brand_id}&zip_code=${IBSN_TC_25_2_zip_code}&caller_id=${HOMEURL.callerId}&channel_id=${HOMEURL.channelId}&channel_name=${HOMEURL.channelName}&job_id=&subject=${HOMEURL.subject}&from=`

        cy.visit(`${Cypress.config().baseUrl}/home${IBSN_TC_25_2_URL}`)
        cy.getBySel(HOMEPAGE_SELECTORS.ST_FRACHISE_SELECT_BUTTON, { timeout: 10000 }).click();
        cy.wait(5000)
        cy.getBySel(CONFIRM_SUBMISSION_POP_UP_SELECTORS.SUBMIT_DIALOG_CREATE_JOB_BUTTON).click();
        cy.wait(5000)
        cy.getBySel(HOMEPAGE_SELECTORS.JOB_SUBMITTED_SUCCESS_MESSAGE).should('have.text', 'Job details have been successfully submitted')
        cy.url().should('eq', `https://go.servicetitan.com/PartnerPortal/CallHandle?portal=premiumservicebrands&tenantId=953040563&callerID=${HOMEURL.callerId}&zip=${HOMEURL.zipCode}`)
    })

    it("IBSN-TC-24 : After clicking the select button, verify that the 'Create a Lead' button located in the confirmation submission popup is working correctly.", () => {
        let IBSN_TC_24_brand_id = "23";
        let IBSN_TC_24_zip_code = "80222"
        const IBSN_TC_24_URL = `?media=${HOMEURL.media}&brand_id=${IBSN_TC_24_brand_id}&zip_code=${IBSN_TC_24_zip_code}&caller_id=${HOMEURL.callerId}&channel_id=${HOMEURL.channelId}&channel_name=${HOMEURL.channelName}&job_id=&subject=${HOMEURL.subject}&from=`
        cy.visit(`/home${IBSN_TC_24_URL}`)

        cy.get('table') 
            .find('tbody>tr') 
            .each((row) => {
                cy.wrap(row)
                    .find('td:nth-child(2)').then((secondrowText) => {
                        if (secondrowText.text() == "kitchenwisesandbox") {
                            console.log(secondrowText.text())
                            cy.wrap(row)
                                .find('td:nth-child(5)').click()
                        }
                    })
            })
        //cy.getBySel(HOMEPAGE_SELECTORS.ST_FRACHISE_SELECT_BUTTON, { timeout: 10000 }).click(); //if need can use this line [need to put 80222 to codimite test kw franchise]
        cy.getBySel(CONFIRM_SUBMISSION_POP_UP_SELECTORS.SUBMIT_DIALOG_CREATE_LEAD_BUTTON).click()
        cy.getBySel(HOMEPAGE_SELECTORS.JOB_SUBMITTED_SUCCESS_MESSAGE).should('have.text', 'Job details have been successfully submitted')
        cy.location("pathname").should('eq', '/leads')
    })

    it("IBSN-TC-23 : After clicking the select button, verify that the 'Cancel' button located in the confirmation submission popup is working properly", () => {
        cy.visit(`/home${HOME_COMMON_URL}`)
        cy.getBySel(HOMEPAGE_SELECTORS.VERIFY_SERCH_FOR_DIFFERENT_FRANCHISE_FIRST_SELECT_BUTTON, { timeout: 10000 }).click();
        cy.getBySel(CONFIRM_SUBMISSION_POP_UP_SELECTORS.SUBMIT_DIALOG_CANCEL_BUTTON).click()
        cy.location("pathname").should('eq', '/home')
    })

    it("IBSN-TC-22 : Verify that search field working properly with invalid Zip code", () => {
        cy.visit(`/home${HOME_COMMON_URL}`)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_ZIP_CODE_SEARCH_INPUT).should('have.value', `${HOMEURL.zipCode}`)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_ZIP_CODE_SEARCH_INPUT).clear()
        cy.wait(3000)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_ZIP_CODE_SEARCH_INPUT).type("665")
        cy.get("#outlined-basic-helper-text").should('have.text', "Invalid ZIP/Postal Code")
        cy.wait(3000)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_ZIP_CODE_SEARCH_INPUT).type("1")
        cy.get("img[margintop='5em']").should('be.visible')
    })

    it("IBSN-TC-21 : Verify that search field working properly with valid Zip code", () => {
        cy.visit(`/home${HOME_COMMON_URL}`)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_ZIP_CODE_SEARCH_INPUT).should('have.value', `${HOMEURL.zipCode}`)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_ZIP_CODE_SEARCH_INPUT).clear()
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_ZIP_CODE_SEARCH_INPUT).type("33881").then(() => {
            let expected_ZIP_Postal_Exact_Match_FranchiseName = "360 Painting of Kissimmee, FL";
            cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_ZIP_CODE_0).click()
            cy.getBySel(CONFIRM_SUBMISSION_POP_UP_SELECTORS.FRANCHISE_NAME).then((y) => {
                let actual_ZIP_Postal_Exact_Match_FranchiseName = y.text()
                assert.equal(actual_ZIP_Postal_Exact_Match_FranchiseName, expected_ZIP_Postal_Exact_Match_FranchiseName)
            })
        })
    })

    it("IBSN-TC-20 : Verify  that the details are correctly filtered to a valid Zip code that has a franchise", () => {
        cy.log("Already covered this in IBSN-TC-21 test case")
    })

    it("IBSN-TC-19 : Verify  that the notify message displayed  properly  to a valid Zip code that hasn't a franchise", () => {
        cy.visit(`/home${HOME_COMMON_URL}`)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_ZIP_CODE_SEARCH_INPUT).should('have.value', `${HOMEURL.zipCode}`)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_ZIP_CODE_SEARCH_INPUT).clear()
        cy.wait(3000)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_ZIP_CODE_SEARCH_INPUT).type("55654")
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_NO_ZIP_CODE_FRANCHISES).should('have.text', 'This ZIP/Postal code (55654) does not belong to any Franchise.')
    })

    it("IBSN-TC-18 : Verify that 'Go to Map' button working properly", () => {
        cy.visit(`/home${HOME_COMMON_URL}`)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_GO_TO_MAP).click()
        cy.get("span[data-index='2']").should('be.visible')
    })

    it("IBSN-TC-17 : Verify that 'Go to Map' UI / MAP back button funchinality", () => {
        cy.visit(`/home${HOME_COMMON_URL}`)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_GO_TO_MAP).click()
        //cy.get("svg[data-testid='CloseIcon']").click({multiple:true})  //this line need to replace when run in DEV and QA env.
        cy.get("[data-testid='ArrowBackIosNewIcon']").click()  //this line need to replace when run in DEV and QA env.
        cy.get("[data-testid='InfoOutlinedIcon']").should('be.visible')
    })

    it("IBSN-TC-16 : Verify that the search field located in the MAP is working correctly", () => {
        cy.visit(`/home${HOME_COMMON_URL}`)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_GO_TO_MAP).click()
        cy.getBySel(HOMEPAGE_SELECTORS.MAP_VIEW_ZIP_CODE_INPUT).clear().type("5555")
        cy.get("#outlined-basic-helper-text").should('have.text', "Please enter a valid zip code")
        cy.getBySel(HOMEPAGE_SELECTORS.MAP_VIEW_ZIP_CODE_SEARCH_BUTTON).should('have.attr', 'disabled');
        cy.getBySel(HOMEPAGE_SELECTORS.MAP_VIEW_ZIP_CODE_INPUT).clear().type("55555")
        cy.getBySel(HOMEPAGE_SELECTORS.MAP_VIEW_ZIP_CODE_SEARCH_BUTTON).click();
        cy.getBySel(HOMEPAGE_SELECTORS.MAP_VIEW_DIALOG_HEADER).should('contain', 'Could not calculate')
        /*after that again need to type another zip code and need to verify no franchise found 90 miles radius modal 
        can't do this because there's a bug (ticket number is https://codimite.atlassian.net/browse/IBSN-149) */
    })

    it("IBSN-TC-15 : Verify after hold the job redirecting in to manual flow by default and shows the success message", () => {
        cy.visit(`/home${HOME_COMMON_URL}`)
        cy.getBySel(HOMEPAGE_SELECTORS.CALLER_DETAILS_HOLD_THE_JOB).click()
        cy.getBySel(HOMEPAGE_SELECTORS.CALLER_DETAILS_HOLD_JOB_SUBMIT_DIALOG_YES).click()
        cy.getBySel(HOMEPAGE_SELECTORS.JOB_SUBMITTED_SUCCESS_MESSAGE).should('have.text', "Job held")
        cy.url().should('eq', `${Cypress.config().baseUrl}/dialer?media=MANUAL&zip_code=&caller_id=&channel_id=&channel_name=` + '&interaction_guid=')
    })

    it("IBSN-TC-15-1 : Verify after cancelling the hold the job modal redirecting to same home page UI", () => {
        cy.visit(`/home${HOME_COMMON_URL}`)
        cy.getBySel(HOMEPAGE_SELECTORS.CALLER_DETAILS_HOLD_THE_JOB).click()
        cy.getBySel(HOMEPAGE_SELECTORS.CALLER_DETAILS_HOLD_JOB_SUBMIT_DIALOG_NO).click()
        cy.get("[data-testid='InfoOutlinedIcon']").should('be.visible')
    })

    it("Verify the displaying message after agent proceed from caller detail page and selected brand not having any franchises in middleware", () => {
        let BRAND_ID_546 = "12";
        cy.visit(`${Cypress.config().baseUrl}/home?media=${HOMEURL.media}&brand_id=${BRAND_ID_546}&zip_code=${HOMEURL.zipCode}&caller_id=${HOMEURL.callerId}&channel_id=${HOMEURL.channelId}&channel_name=${HOMEURL.channelName}&job_id=&subject=${HOMEURL.subject}&from=`)
        cy.getBySel(HOMEPAGE_SELECTORS.AUTOPICK_INCORRECT_ZIP_ERROR_MESSAGE).should('have.text', `This ZIP/Postal code (${HOMEURL.zipCode}) does not belong to any Franchise.`)
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_VIEW_GO_TO_MAP).should('have.attr', 'disabled');
        cy.getBySel(HOMEPAGE_SELECTORS.FRANCHISE_SELECT_NO_NEAR_BY_LOCATIONS).should('have.text', 'No Next Nearby Locations')
    })

})