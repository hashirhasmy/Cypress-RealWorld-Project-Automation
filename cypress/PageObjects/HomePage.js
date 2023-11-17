class HomePage {

     HOMEPAGE_SELECTORS = {
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
        MAP_VIEW_DIALOG_HEADER: "map_view_dialog_header",
        CALLERDETAILPAGE_APPLICATION_PANAL : "caller_details_application_panel"
    }
    
    CONFIRM_SUBMISSION_POP_UP_SELECTORS = {
        CALLER_ID: "submit_dialog_caller_id",
        FRANCHISE_NAME: "submit_dialog_franchise_name",
        ZIPCODE: "submit_dialog_zip_code",
        CREATE_JOB_WITHIN_MIDDLEWARE_BUTTON: "submit_dialog_create_job_within_middleware_button",
        SUBMIT_DIALOG_CREATE_JOB_BUTTON: "submit_dialog_create_job_button",
        SUBMIT_DIALOG_CREATE_LEAD_BUTTON: "submit_dialog_create_a_lead_button",
        SUBMIT_DIALOG_CANCEL_BUTTON: "submit_dialog_cancel_button"
    }


    submit_job (){
        cy.getBySel(this.HOMEPAGE_SELECTORS.ST_FRACHISE_SELECT_BUTTON, { timeout: 10000 }).click();
        cy.getBySel(this.CONFIRM_SUBMISSION_POP_UP_SELECTORS.CREATE_JOB_WITHIN_MIDDLEWARE_BUTTON).click(); //should have 33880 zip code in polk country franchise
        //cy.url().should('eq', `${Cypress.config().baseUrl}/jobs?isNew=true&brandId=${HOMEURL.BRANDID}&franchiseId=1350&callerId=${HOMEURL.callerId}&zipCode=${HOMEURL.zipCode}`)
        //cy.getBySel(this.HOMEPAGE_SELECTORS.JOB_SUBMITTED_SUCCESS_MESSAGE).should('have.text', 'Job details have been successfully submitted')
    }

    hold_job(){
        cy.getBySel(this.HOMEPAGE_SELECTORS.CALLER_DETAILS_HOLD_THE_JOB).click()
        cy.getBySel(this.HOMEPAGE_SELECTORS.CALLER_DETAILS_HOLD_JOB_SUBMIT_DIALOG_YES).click()
        cy.getBySel(this.HOMEPAGE_SELECTORS.JOB_SUBMITTED_SUCCESS_MESSAGE).should('have.text', "Job held")
    }

    click_Application_panal(){
        cy.getBySel(this.HOMEPAGE_SELECTORS.CALLERDETAILPAGE_APPLICATION_PANAL).click()
    }

}

export default HomePage;