import { emailTemplateFactory } from "./email-factory";
import PasswordRecoveryEmailTemplate from "./templates/PasswordRecoveryEmail";
export const PasswordRecoveryEmail = emailTemplateFactory(PasswordRecoveryEmailTemplate);
import WelcomeEmailTemplate from "./templates/WelcomeEmail";
export const WelcomeEmail = emailTemplateFactory(WelcomeEmailTemplate);
import WelcomeEmailTwoTemplate from "./templates/WelcomeEmailTwo";
export const WelcomeEmailTwo = emailTemplateFactory(WelcomeEmailTwoTemplate);