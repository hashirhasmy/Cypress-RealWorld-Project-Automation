class CallLogsPage {

    callLogsPage_WebLocators =  {
        callLogsNavbar_button : 'a[href="/call-logs"]',
        jobs_on_hold_button : 'button:nth-child(2)'
    }

    click_CallLogs_Button(){
        cy.get(this.callLogsPage_WebLocators.callLogsNavbar_button).click()
    }

    click_jobs_on_hold_page(){
        cy.get(this.callLogsPage_WebLocators.jobs_on_hold_button).click()
    }



}

export default CallLogsPage;