export const Common = {
	colors: {
		primary: "#FF3821",
		secondary: "#FF5501",
		emphasize: "#FFB258",
		white: "#F5F2F5",
		gray: "#828280",
		gray2: "#D9D9D9",
		black: "#28282C",
	},
	font: {
		size: {
			sm: "12px",
			lg: "24px",
			xl: "50px",
		},
		weight: {
			extraLight: "200",
			regular: "500",
			bold: "700",
		},
	},
	space: {
		spacingMd: "10px",
		spacingLg: "20px",
		spacingXl: "30px",
	},
	a11yHidden: `
  overflow: hidden;
  position: absolute !important;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  width: 1px;
  height: 1px;
  margin: -1px;
  `,
	reset: `
    html,
    body,
    div,
    span,
    applet,
    object,
    iframe,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    blockquote,
    pre,
    a,
    abbr,
    acronym,
    address,
    big,
    cite,
    code,
    del,
    dfn,
    em,
    img,
    ins,
    kbd,
    q,
    s,
    samp,
    small,
    strike,
    strong,
    sub,
    sup,
    tt,
    var,
    b,
    u,
    i,
    center,
    dl,
    dt,
    dd,
    ol,
    ul,
    li,
    fieldset,
    form,
    label,
    legend,
    table,
    caption,
    tbody,
    tfoot,
    thead,
    tr,
    th,
    td,
    article,
    aside,
    canvas,
    details,
    embed,
    figure,
    figcaption,
    footer,
    header,
    hgroup,
    menu,
    nav,
    output,
    ruby,
    section,
    summary,
    time,
    mark,
    audio,
    video {
      margin: 0;
      padding: 0;
      border: 0;
      vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article,
    aside,
    details,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    menu,
    nav,
    section {
      display: block;
    }
    body {
      line-height: 1;
      overscroll-behavior: none;
    }
    ol,
    ul {
      list-style: none;
    }
    blockquote,
    q {
      quotes: none;
    }
    blockquote:before,
    blockquote:after,
    q:before,
    q:after {
      content: "";
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    button {
      cursor: pointer;
    }
    *,
    *::after,
    *::before {
      box-sizing: border-box;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
    }
    html {
      font-size: 18px;
      font-family:
        "Pretendard Variable",
        Pretendard,
        -apple-system,
        BlinkMacSystemFont,
        system-ui,
        Roboto,
        "Helvetica Neue",
        "Segoe UI",
        "Apple SD Gothic Neo",
        "Noto Sans KR",
        "Malgun Gothic",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        sans-serif;
    }
    main{
      min-height: calc(100vh - 100px);
    }
  `,
};
