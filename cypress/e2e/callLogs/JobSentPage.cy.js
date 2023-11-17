/// <reference types="cypress" />

import DiallerPage from "../../PageObjects/DiallerPage"
import CallLogsPage from "../../PageObjects/callLogsPage"
import HomePage from "../../PageObjects/homePage"
import properties from "../../fixtures/properties.json"

describe("Job sent page Tests", () => {

    beforeEach(function () {
        const rt = Cypress.env('RT')
        const domain = Cypress.env('BACKEND_URL')
        cy.setCookie("rt", rt, { domain: domain, httpOnly: false, secure: true, sameSite: "no_restriction" })
    })

    for (let i = 1; i <= 3; i++) { // Change 3 to the number of times you want to repeat the test
        it(`TC_001_${i} Verify after submit a job, job relevent information will store in DB and display the correct information in Job sent page`, () => {
            const homePage = new HomePage();
            const callLogsPage = new CallLogsPage();
            cy.loginApp(properties.zipCode, properties.callerId)
            homePage.submit_job();
            cy.location("pathname").should("eq", "/jobs");
            callLogsPage.click_CallLogs_Button();
            cy.location("pathname").should("eq", "/call-logs");
            cy.get('table tbody tr:first-child')
                .within(() => {
                    cy.wait(3000)
                    cy.get('td:nth-child(2)').should('contain', '2234567890');
                    cy.get('td:nth-child(3)').should('contain', '33880');
                    cy.get('td:nth-child(5)').should('contain', '360 Polk County, FL');
                });
        })
    }

    it("TC_002_Verify the job sent count correctly diplay in job sent page for the current date", () => {
        cy.visit('/call-logs')
        cy.wait(10000)
        cy.get('table tbody')
            .find('tr') // Find all table rows
            .should('have.length.gt', 0) // Ensure there are rows in the table
            .then((tableRows) => {
                const rowCountInTable = tableRows.length;
                // Extract the count displayed at the top of the page for a single page
                cy.get('strong') 
                    .then((pageCountText) => {
                        const pageCount = parseInt(pageCountText.text());
                        //expect(rowCountInTable).to.equal(pageCount);
                        cy.wrap(rowCountInTable).should('be.at.most', pageCount);  //if this fail please uncomment the 47th line and comment the 48th line
                    });
            });
    })

    it("TC_003_Verify after hold a job, holded job relevent details get shows in hold job page", () => {
        const homePage = new HomePage();
        const callLogsPage = new CallLogsPage();
        const diallerPage = new DiallerPage();
        cy.loginApp(properties.zipCode, properties.callerId)
        cy.wait(4000)
        homePage.hold_job();
        diallerPage.click_Applicationpanal_Button()
        callLogsPage.click_jobs_on_hold_page()
        cy.get('table tbody tr:first-child')
            .within(() => {
                cy.wait(3000)
                cy.get('td:nth-child(2)').should('contain', '2234567890');
                cy.get('td:nth-child(3)').should('contain', '33880');
                cy.get('td:nth-child(6)').should('contain', 'mhashir@codimite.com');
            });
    })

    it("TC_004_Verify the hold job count correctly diplay in job sent page for the current date", () => {
        cy.visit('/call-logs')
        const callLogsPage = new CallLogsPage();
        callLogsPage.click_jobs_on_hold_page()
        cy.wait(10000)
        cy.get('table tbody')
            .find('tr')
            .should('have.length.gt', 0)
            .then((tableRows) => {
                const rowCountInTable = tableRows.length;
                cy.get('strong')
                    .then((pageCountText) => {
                        const pageCount = parseInt(pageCountText.text());
                        cy.wait(2000)
                        //expect(rowCountInTable).to.equal(pageCount);
                        cy.wrap(rowCountInTable).should('be.at.most', pageCount);
                    });
            });
    })

})