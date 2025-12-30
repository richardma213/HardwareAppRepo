export const lightTheme = {
  bg: "#ffececff",
  card: "#ffffffff",
  text: "#1f1e1eff",
  border: "#f9f9f9ff",
  navbar: "rgb(238, 237, 255)",
  gpubg: "#d0e0ffff"
  
};

export const darkTheme = {
  bg: "#252525ff",
  card: "#3c3c3cff",
  text: "#e8e8e8ff",
  border: "#2e2e2e",
  navbar: "#2e2e2e",
  gpubg: "#252525ff"
};

export function applyTheme(theme) {
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
  });
}



