import { Selector } from 'testcafe';
import { adminCredentials, signInAs } from './_helpers';

class ListSuggestionsPageTest {
  constructor() {
    this.pageId = '#list-suggestions-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async isDisplayed(tc) {
    await tc.expect(this.pageSelector.exists).ok();
    await tc.expect(this.pageSelector.visible).ok();
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async test(tc) {
    await signInAs(tc, adminCredentials);
    await tc.navigateTo('/#/list-suggestions');
    await this.isDisplayed(tc);
  }
}

export const listSuggestionsPageTest = new ListSuggestionsPageTest();
