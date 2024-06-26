import { Selector } from 'testcafe';
import { compliantParticipantCredentials, signInAs } from './_helpers';

class CreateTeamTest {
  constructor() {
    this.pageId = '#create-team-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async isDisplayed(tc) {
    await tc.expect(this.pageSelector.exists).ok();
    await tc.expect(this.pageSelector.visible).ok();
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async test(tc) {
    await signInAs(tc, compliantParticipantCredentials);
    await tc.navigateTo('/#/create-team');
    await this.isDisplayed(tc);
  }
}

export const createTeamTest = new CreateTeamTest();
