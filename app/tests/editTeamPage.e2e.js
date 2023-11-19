import { Selector } from 'testcafe';
import { compliantParticipantCredentials, signInAs } from './_helpers';

class EditTeamPageTest {
  constructor() {
    this.pageId = '#edit-team-page';
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
    await tc.navigateTo('/#/your-teams');
    await tc.click(Selector('a').withExactText('Edit Team'));
    await this.isDisplayed(tc);
  }
}

export const editTeamPageTest = new EditTeamPageTest();
