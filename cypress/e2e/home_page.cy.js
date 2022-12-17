describe("Home page and input testing", () => {
  it("Should have a title", () => {
    cy.visit('/')
    cy.get('[data-cy=title]')
      .should('exist')
  })

  it("Should have a disabled submit button while no inputs exist", () => {
    cy.get('button').should('be.disabled')
  })
  
  it("Should have a file input", () => {
    cy.get('input[name="inputFile"]')
      .should('exist')
  })

  it("Should have a stop word file input", () => {
    cy.get('input[name="stopWordFile"]')
      .should('exist')
  })

  it("Should not accept non txt file", () => {
    cy.get('input[name="inputFile"]').selectFile({
      contents: Cypress.Buffer.from('Test, CSV'),
      fileName: 'Test.csv',
      mimeType: 'text/csv',
      lastModified: Date.now()
    }, {
      force: true
    }).wait(2000)
  })

  it("Should allow input file to accept txt files", () => {
    cy.get('input[name="inputFile"]').selectFile({
      contents: Cypress.Buffer.from("The quick brown fox jumped over the lazy dog"),
      fileName: 'Test.txt',
      mimeType: 'text/plain',
      lastModified: Date.now()
    }, {
      force: true
    })
  })

  it("Should let stopWords be txt files", () => {
    cy.get('input[name="stopWordFile"]').selectFile({
      contents: Cypress.Buffer.from('the fox'),
      fileName: 'TestStopWords.txt',
      mimeType: 'text/plain',
      lastModified: Date.now()
    }, {
      force: true
    })
  })

  it("Should have an enabled submit button when inputs are entered", () => {
    cy.wait(1000)
    cy.get("[data-cy=submit-btn]").should('be.enabled').click({force: true})
  })

  it("Should give results when submitted", () => {
    cy.get("[data-cy=results-table]").should("exist")
  })

  it("Should display the number of items displayed", () => {
    cy.get("[data-cy=num-results]").should("exist")
  })

  it("Should update the top N posts when a new number is input", () => {
    cy.get("[data-cy=top-num-changer]").focus().type("{backspace}4")
    cy.get("[data-cy=top-num-submit]").click()
    cy.get("[data-cy=top-num-title]").should("contain.text", "4").wait(2000)
  })

  it("Should upper bound to size of the list (unique items: not total)", () => {
    cy.get("[data-cy=top-num-changer]").focus().type("{backspace}100")
    cy.get("[data-cy=top-num-submit]").click()
    cy.get("[data-cy=top-num-title]").should("contain.text", "6").wait(2000)
  })

  it("Should reset the form data and the table when clicked", () => {
    // cy.get("[data-cy=reset-btn]").click({force: true})
  })
})