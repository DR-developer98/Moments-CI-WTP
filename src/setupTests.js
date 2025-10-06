// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// 25e. import setUpServer voor onze tests uit de geïmporteerde
// msw-bibliotheek
import { setupServer } from "msw/node";
// 25f. import de handlers uit handlers.js
import { handlers } from './mocks/handlers';

// 25g. We roepen de server.listen()-methode aan bevor jedem Test;
beforeAll(() => server.listen());
// 25ga. we roepen de server.resetHandlers()-methode aan na iedere test;
afterEach(() => server.resetHandlers());
// 25gb. We roepen de server.close()-methode aan om de server af te sluiten 
// als alle tests eenmaal uitgevoerd zijn
afterAll(() => server.close());