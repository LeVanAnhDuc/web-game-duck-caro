import type { Locator, Page } from "@playwright/test";
import { copy } from "@/data/copy";

/** The optional Ducker ID sign-in in the header (flag-on build only): the button, the avatar trigger and its menu. */
export class AccountMenu {
  constructor(readonly page: Page) {}

  /** Matched by its exact name: the in-flight label "Đang đăng nhập…" must not count as the button being back. */
  signInButton(): Locator {
    return this.page.getByRole("button", { name: copy.account.signIn, exact: true });
  }

  /** Either state of the sign-in button: idle or in flight. */
  anySignIn(): Locator {
    return this.page.getByRole("button", { name: /^(Đăng nhập|Đang đăng nhập…)$/ });
  }

  trigger(): Locator {
    return this.page.getByRole("button", { name: copy.account.menu, exact: true });
  }

  menu(): Locator {
    return this.page.getByRole("menu");
  }

  profileLink(): Locator {
    return this.menu().getByRole("menuitem", { name: copy.account.openProfile });
  }

  signOutItem(): Locator {
    return this.menu().getByRole("menuitem", { name: copy.account.signOut });
  }

  /**
   * Presses Đăng nhập and waits until the page has been to the issuer and back: the authorize request is answered
   * with a redirect home, then the home page loads again.
   */
  async signInRoundTrip(issuer: string): Promise<void> {
    const bounced = this.page.waitForResponse((r) => r.url().startsWith(`${issuer}/oauth/authorize`));
    await this.signInButton().click();
    await bounced;
    await this.page.waitForLoadState("load");
  }
}
