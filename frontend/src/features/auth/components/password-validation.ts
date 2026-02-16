const MIN_LENGTH = 8;
const SPECIAL_CHARACTERS = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;

export const PASSWORD_CRITERIA = {
  LENGTH: `be at least ${MIN_LENGTH} characters long`,
  LOWER: "contain at least one lowercase letter",
  UPPER: "contain at least one uppercase letter",
  DIGIT: "contain at least one digit",
  SPECIAL: "contain at least one special character",
} as const;

export type PasswordCriteriaResult = {
  [key: string]: boolean;
};

export default function PasswordValidation(password: string): {
  isStrong: boolean;
  criteria: PasswordCriteriaResult;
} {
  const criteria: PasswordCriteriaResult = {
    [PASSWORD_CRITERIA.LENGTH]: password.length >= MIN_LENGTH,
    [PASSWORD_CRITERIA.LOWER]: /[a-z]/.test(password),
    [PASSWORD_CRITERIA.UPPER]: /[A-Z]/.test(password),
    [PASSWORD_CRITERIA.DIGIT]: /\d/.test(password),
    [PASSWORD_CRITERIA.SPECIAL]: new RegExp(
      `[${SPECIAL_CHARACTERS.replace(/[\\^\-\]]/g, "\\$&")}]`,
    ).test(password),
  };

  const isStrong = Object.values(criteria).every((passed) => passed);

  return { isStrong, criteria };
}
