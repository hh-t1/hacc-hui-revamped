import { Selector } from 'testcafe';
import { adminCredentials, signInAs } from './_helpers';

class ListParticipantsAdminPageTest {
  constructor() {
    this.pageId = '#list-participants-admin-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async isDisplayed(tc) {
    await tc.expect(this.pageSelector.exists).ok();
    await tc.expect(this.pageSelector.visible).ok();
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async test(tc) {
    // await tc.debug();
    await signInAs(tc, adminCredentials);
    await tc.navigateTo('/#/list-participants-admin');
    await this.isDisplayed(tc);
  }
}

export const listParticipantsAdminPageTest =
  new ListParticipantsAdminPageTest();
