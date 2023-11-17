/// <reference types="cypress" />

const HOMEPAGE_SELECTORS = {
  AUTOPICK_INCORRECT_ZIP_ERROR_MESSAGE: "franchise_select_view_no_auto_pick_franchises",
  AUTOPICK_FRANCHISE_NAME: "div[class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-4 css-1udb513'] p",
  VERIFY_SERCH_FOR_DIFFERENT_FRANCHISE_FIRST_SELECT_BUTTON: "franchise_select_view_next_near_by_franchises_0"
}

const HOMEURL = {
  media: "MANUAL",
  BRANDID: "10",
  zipCode: "33880",
  channelId: "",
  callerId: "1234567899",
  channelName: "",
  subject: "",
}
const HOME_COMMON_URL = `?media=${HOMEURL.media}&brand_id=${HOMEURL.BRANDID}&zip_code=${HOMEURL.zipCode}&caller_id=${HOMEURL.callerId}&channel_id=${HOMEURL.channelId}&channel_name=${HOMEURL.channelName}&job_id=&subject=${HOMEURL.subject}&from=`

describe('Home Page UI test flows', () => {

  beforeEach(function () {
    const rt = Cypress.env('RT')
    const domain = Cypress.env('BACKEND_URL')
    cy.setCookie("rt", rt, { domain: domain, httpOnly: false, secure: true, sameSite: "no_restriction" })
  })

  it('IBSN-TC-30 : If there is a relevant franchise under the zip code entered, verify  that the agent can see it with the select button ,under the  Auto picked franchise topic', () => {
    cy.visit(`${Cypress.config().baseUrl}/home${HOME_COMMON_URL}`)
    cy.get(HOMEPAGE_SELECTORS.AUTOPICK_FRANCHISE_NAME, { timeout: 10000 }).should('be.visible').then((element) => { //data-test need to add
      const expectedAutoPickedFranchiseName = "360 Polk County, FL"
      const ActualAutoPickedFranchiseName = element.text()
      assert.equal(ActualAutoPickedFranchiseName, expectedAutoPickedFranchiseName)
    })
  })

  it('IBSN-TC-31 : Verify that home page UI', () => {
    cy.visit(`${Cypress.config().baseUrl}/home${HOME_COMMON_URL}`)
    cy.location("pathname").should("eq", "/home");
    //need to modify
  })

  it("IBSN-TC-29 : If there is not  a relevant franchise under the zip code entered, verify  that the agent can see 'This ZIP/Postal code (34435) does not belong to any Franchise.' message   ,under the  Auto picked franchise topic", () => {
    const IBSN_TC_29_zipcode = 34435;
    let IBSN_TC_29_URL = `?media=${HOMEURL.media}&brand_id=${HOMEURL.BRANDID}&zip_code=${IBSN_TC_29_zipcode}&caller_id=${HOMEURL.callerId}&channel_id=${HOMEURL.channelId}&channel_name=${HOMEURL.channelName}&job_id=&subject=${HOMEURL.subject}&from=`
    cy.visit(`${Cypress.config().baseUrl}/home${IBSN_TC_29_URL}`)
    cy.getBySel(HOMEPAGE_SELECTORS.AUTOPICK_INCORRECT_ZIP_ERROR_MESSAGE).should('have.text', 'This ZIP/Postal code (34435) does not belong to any Franchise.')
  })

  it("IBSN-TC-28 : Verify that Next Nearby Locations", () => {
    cy.visit(`${Cypress.config().baseUrl}/home${HOME_COMMON_URL}`)
    cy.wait(3000)
    cy.getBySel(HOMEPAGE_SELECTORS.VERIFY_SERCH_FOR_DIFFERENT_FRANCHISE_FIRST_SELECT_BUTTON, { timeout: 10000 }).should('be.enabled')

    cy.log("--------------(1) Verify the rows and column count of the page------------------")

    cy.get("table>tbody>tr", { timeout: 10000 }).should('have.length', 120) //expected 150 can get change env. wise
      .its('length')
      .then((rowcount) => {
        cy.log('Table row count: ' + rowcount);
      });

    cy.get("table>thead>tr>th", { timeout: 10000 }).should('have.length', 5)
      .its('length')
      .then((columnCount) => {
        cy.log('Table column count: ' + columnCount);
      });

    cy.log("------------(2) Check data from specific row and column---------------")

    cy.get('table') 
      .find('tbody>tr') 
      .each((row) => {
        cy.wrap(row)
          .find('td:nth-child(2)').then((secondrowText) => {
            if (secondrowText.text() == "360 Painting of Kissimmee, FL") {
              cy.wrap(row)
                .find('td:nth-child(4)').then((fourthcolumnText) => {
                  let expectedText = "> 90 miles"
                  let actualwantedText = fourthcolumnText.text()
                  assert.equal(actualwantedText, expectedText)
                })
            }
          })
      })
  })

})
