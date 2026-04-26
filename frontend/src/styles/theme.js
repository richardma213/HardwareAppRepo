export const lightTheme = {
  bg: "linear-gradient(160deg, #f8f7ff 0%, #f4f8ff 42%, #fff6fb 100%)",
  card: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(252,249,255,0.92) 100%)",
  text: "#1f1e24",
  border: "rgba(107, 115, 165, 0.22)",
  navbar: "linear-gradient(90deg, rgba(235,240,255,0.92) 0%, rgba(245,237,255,0.92) 50%, rgba(255,236,246,0.9) 100%)",
  gpubg: "linear-gradient(130deg, rgba(63,123,255,0.2) 0%, rgba(122,67,242,0.16) 50%, rgba(248,87,166,0.15) 100%)",
  panel: "rgba(255, 255, 255, 0.78)",
  shadow: "0 10px 30px rgba(73, 55, 130, 0.12)",
  backdropGlow: "radial-gradient(circle at 10% 8%, rgba(108,135,255,0.16), transparent 42%), radial-gradient(circle at 86% 18%, rgba(248,87,166,0.13), transparent 36%)"
};

export const darkTheme = {
  bg: "linear-gradient(165deg, #161822 0%, #1a1930 45%, #261a2f 100%)",
  card: "linear-gradient(180deg, rgba(31,34,47,0.86) 0%, rgba(39,33,54,0.86) 100%)",
  text: "#ececff",
  border: "rgba(163, 171, 223, 0.24)",
  navbar: "linear-gradient(90deg, rgba(30,35,58,0.9) 0%, rgba(46,33,70,0.9) 50%, rgba(68,36,72,0.9) 100%)",
  gpubg: "linear-gradient(130deg, rgba(71,110,255,0.26) 0%, rgba(123,85,223,0.2) 50%, rgba(189,89,160,0.18) 100%)",
  panel: "rgba(34, 37, 53, 0.72)",
  shadow: "0 16px 34px rgba(0, 0, 0, 0.36)",
  backdropGlow: "radial-gradient(circle at 12% 8%, rgba(82,106,220,0.18), transparent 44%), radial-gradient(circle at 88% 14%, rgba(162,75,156,0.16), transparent 38%)"
};

export function applyTheme(theme) {
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
  });
}



