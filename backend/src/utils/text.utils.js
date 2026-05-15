const GREETING_REGEX = /^(hey+|hi+|hello+|yo+|good (morning|afternoon|evening))[\s,!.-]*/i;

/* Remove greeting from text */
function removeGreeting(text) {
  let cleaned = text.trim();
  let prev;

  do {
    prev = cleaned;

    cleaned = cleaned
      .replace(GREETING_REGEX, "")
      .replace(/^(how are you|what's up|wassup|how's it going)[\s,!.-]*/i, "")
      .trim();

  } while (cleaned !== prev);

  return cleaned;
}


/* To check if a message has low intent */
function isLowIntentMessage(text) {
  const cleaned = removeGreeting(text).toLowerCase();

  if (!cleaned) return true;

  const words = cleaned.split(/\s+/);

  if (cleaned.length < 6) return true;
  if (words.length < 2) return true;

  const LOW_INTENT_EXACT = [
    "ok",
    "okay",
    "thanks",
    "thank you",
    "cool",
    "nice",
    "hmm",
    "huh",
    "yes",
    "no",
    "lol",
  ];

  if (LOW_INTENT_EXACT.includes(cleaned)) return true;

  const SMALL_TALK_REGEX =
    /^(i am|i'm|im|doing|feeling|fine|good|great|okay|ok|not bad|all good|pretty good)/;

  if (SMALL_TALK_REGEX.test(cleaned)) return true;

  return false;
}

module.exports = {
  removeGreeting,
  isLowIntentMessage,
};
