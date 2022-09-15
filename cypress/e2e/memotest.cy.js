/// <reference types="Cypress" />

const URL = "index.html";
const NUMERO_CARTAS = 12;

context("memotest", () => {
  before(() => {
    cy.visit(URL);
  });

  describe("el juego no inicia si no pulsamos el boton jugar", () => {
    it("se asegura que haya un tablero con cuadros", () => {
      cy.get("#contenedor").find(".carta").should("have.length", NUMERO_CARTAS);
    });
    it("se asegura que haya un boton jugar", () => {
      cy.get("#jugar").should("exist").should("be.enabled");
    });
    it("se asegura que las cartas no se puedan seleccionar", () => {
      cy.get("#contenedor").should("have.class", "bloquear");
    });
  });

  describe("juega al memotest", () => {
    it("se asegura que funcione el boton jugar", () => {
      cy.get("#jugar").click();
      cy.get("#jugar").should("be.disabled");
    });
    it("se asegura que las cartas se puedan seleccionar", () => {
      cy.get("#contenedor").should("not.have.class", "bloquear");
    });
    it("se asegura que las cartas sean aleatorias", () => {
      cy.get(".carta").then((cartas) => {
        let idsOriginales = [];
        cartas.each((i, carta) => {
          idsOriginales.push(carta.id);
        });

        cy.visit(URL);

        let idsNuevas = [];
        cy.get(".carta").then((nuevasCartas) => {
          nuevasCartas.each((i, carta) => {
            idsNuevas.push(carta.id);
          });

          cy.wrap(idsOriginales).should("not.deep.equal", idsNuevas);
        });
      });
    });
  });

  describe("resuelve el juego", () => {
    let mapaDePares, listaDePares;
    it("elige una combinación errónea", () => {
      cy.get("#jugar").click();
      cy.get(".carta").then((cartas) => {
        mapaDePares = obtenerParesDeCartas(cartas);
        listaDePares = Object.values(mapaDePares);

        console.log(mapaDePares);
        console.log(listaDePares);
        cy.get(listaDePares[0][0]).click();
        cy.get(listaDePares[1][0]).click();

        cy.get(".carta").should("have.length", NUMERO_CARTAS);
      });
    });
    it("completa el juego", () => {
      listaDePares.forEach((par) => {
        cy.get(par[0]).click();
        cy.get(par[1]).click();
      });
      cy.get(".carta").should("have.length", 0);
      cy.on("window:alert", (text) => {
        expect(text).to.eq(
          "Ganaste! para volver a jugar seleccione jugar nuevamente"
        );
        //done();
      });
    });
  });
});

function obtenerParesDeCartas(cartas) {
  const pares = {};

  cartas.each((i, carta) => {
    const idColor = carta.id;
    if (pares[idColor]) {
      pares[idColor].push(carta);
    } else {
      pares[idColor] = [carta];
    }
  });
  return pares;
}
