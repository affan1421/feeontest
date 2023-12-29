export const Dashboard = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="dashboard">
          <mask
            id="mask0_5449_74"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="24"
          >
            <rect id="Bounding box" x="0.5" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_5449_74)">
            <path
              id="dashboard_2"
              d="M13.5 9V3H21.5V9H13.5ZM3.5 13V3H11.5V13H3.5ZM13.5 21V11H21.5V21H13.5ZM3.5 21V15H11.5V21H3.5ZM5.5 11H9.5V5H5.5V11ZM15.5 19H19.5V13H15.5V19ZM15.5 7H19.5V5H15.5V7ZM5.5 19H9.5V17H5.5V19Z"
              fill={isActive ? fill : "#999999"}
            />
          </g>
        </g>
      </svg>
    </>
  );
};

export const Feesetup = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <mask
          id="mask0_3822_35812"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3822_35812)">
          <mask
            id="mask1_3822_35812"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask1_3822_35812)">
            <path
              d="M16 13.5C16.4333 13.5 16.7917 13.3583 17.075 13.075C17.3583 12.7917 17.5 12.4333 17.5 12C17.5 11.5667 17.3583 11.2083 17.075 10.925C16.7917 10.6417 16.4333 10.5 16 10.5C15.5667 10.5 15.2083 10.6417 14.925 10.925C14.6417 11.2083 14.5 11.5667 14.5 12C14.5 12.4333 14.6417 12.7917 14.925 13.075C15.2083 13.3583 15.5667 13.5 16 13.5ZM5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V7.5H19V5H5V19H19V16.5H21V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM13 17C12.45 17 11.9792 16.8042 11.5875 16.4125C11.1958 16.0208 11 15.55 11 15V9C11 8.45 11.1958 7.97917 11.5875 7.5875C11.9792 7.19583 12.45 7 13 7H20C20.55 7 21.0208 7.19583 21.4125 7.5875C21.8042 7.97917 22 8.45 22 9V15C22 15.55 21.8042 16.0208 21.4125 16.4125C21.0208 16.8042 20.55 17 20 17H13ZM20 15V9H13V15H20Z"
              fill={isActive ? fill : "#999999"}
            />
          </g>
        </g>
      </svg>
    </>
  );
};

export const Savings = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Layer 1">
          <path
            id="Vector"
            d="M1.89246 20.5242C1.49724 20.3721 1.16847 20.1475 1.05829 19.6953C1.01994 19.5361 1.00037 19.3727 1 19.2086C1 15.7443 1 12.2798 1 8.81509C1 8.12138 1.29613 7.67521 1.85749 7.53092C1.98477 7.50397 2.11473 7.49303 2.24455 7.49831C7.58417 7.49831 12.9238 7.50375 18.264 7.48926C18.9635 7.48926 19.5418 7.96622 19.5155 8.7843C19.4975 9.35183 19.5155 9.92116 19.5155 10.4899C19.5215 10.5133 19.5303 10.5358 19.5418 10.5569H19.7837C20.4762 10.5605 20.9571 10.9596 20.9758 11.6678C21.0096 12.9832 21.008 14.2996 20.9711 15.6169C20.9536 16.2738 20.4774 16.6795 19.839 16.6995C19.7388 16.6995 19.6385 16.6995 19.5097 16.6995V16.9585C19.5097 17.7295 19.5132 18.4998 19.5097 19.2708C19.5056 19.9168 19.2602 20.2676 18.6796 20.4844C18.6611 20.4948 18.6442 20.5081 18.6295 20.5236L1.89246 20.5242ZM18.7647 12.0868V11.8127C18.7647 10.8177 18.7647 9.82235 18.7647 8.82656C18.7647 8.37194 18.658 8.26326 18.2109 8.26326H2.318C1.85632 8.26326 1.75606 8.3659 1.75606 8.83864C1.75606 12.2885 1.75606 15.7385 1.75606 19.1887C1.75606 19.2636 1.73332 19.3535 1.76538 19.4103C1.8232 19.5299 1.90652 19.6344 2.00905 19.7158C2.09007 19.7695 2.21774 19.7581 2.32499 19.7581C7.08751 19.7581 11.85 19.7581 16.6125 19.7581C17.1622 19.7581 17.7114 19.7581 18.2605 19.7581C18.6376 19.7581 18.7635 19.624 18.7635 19.2292C18.7635 18.4644 18.7635 17.7011 18.7635 16.9391C18.7635 16.8667 18.7577 16.7936 18.7536 16.6976H18.5076C17.6333 16.6976 16.7589 16.7019 15.8845 16.6976C15.1815 16.6928 14.7029 16.2146 14.6935 15.4962C14.6836 14.7554 14.6819 14.0146 14.6935 13.2738C14.7052 12.5752 15.1791 12.1007 15.8524 12.0856C15.9538 12.0856 16.0547 12.0856 16.1561 12.0856L18.7647 12.0868ZM20.2401 12.8856C20.1977 12.8777 20.1549 12.8722 20.1119 12.8693C18.7035 12.8693 17.2952 12.8656 15.8874 12.8693C15.5685 12.8693 15.4508 13.0033 15.449 13.342C15.4449 14.0152 15.449 14.6878 15.449 15.3609C15.449 15.8282 15.5394 15.9194 15.9999 15.9194H19.206C19.4392 15.9194 19.6683 15.9242 19.8985 15.9104C20.1078 15.8983 20.2372 15.7661 20.2389 15.5511C20.2436 14.6678 20.2401 13.7864 20.2401 12.8856ZM20.2168 12.0784C20.3159 11.4595 20.0815 11.2192 19.526 11.3659V12.0784H20.2168Z"
            fill={isActive ? fill : "#999999"}
            stroke={isActive ? fill : "#999999"}
            strokeWidth="0.7"
          />
          <g id="Group 9">
            <path
              id="Vector 15"
              d="M4.80981 8.14242V5.81182C4.80981 5.42522 5.12322 5.11182 5.50981 5.11182H8.2445"
              fill={isActive ? fill : "#999999"}
            />
            <path
              id="Vector 16"
              d="M8.24438 8.14242V3.99346C8.24438 3.60686 8.55779 3.29346 8.94438 3.29346H11.6791"
              fill={isActive ? fill : "#999999"}
            />
            <path
              id="Vector 17"
              d="M11.6792 8.14243V2.1751C11.6792 1.7885 11.9926 1.4751 12.3792 1.4751H14.4139C14.8005 1.4751 15.1139 1.7885 15.1139 2.1751V8.14243"
              fill={isActive ? fill : "#999999"}
            />
          </g>
        </g>
      </svg>
    </>
  );
};

export const Receipt = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.09375 9.73937V8.17692H11.9062V9.73937H4.09375ZM4.09375 5.5727V4.01025H11.9062V5.5727H4.09375ZM1.74997 12.3436H9.56247C10.0259 12.3436 10.4546 12.4437 10.8485 12.6441C11.2425 12.8444 11.577 13.1275 11.8521 13.4934L14.25 16.6184V1.98703C14.25 1.89354 14.2199 1.81674 14.1598 1.75663C14.0997 1.69653 14.0229 1.66648 13.9294 1.66648H2.07052C1.97703 1.66648 1.90023 1.69653 1.84013 1.75663C1.78003 1.81674 1.74997 1.89354 1.74997 1.98703V12.3436ZM2.07052 18.3331H13.5909L10.6222 14.4489C10.4913 14.2766 10.3354 14.1431 10.1544 14.0483C9.97347 13.9534 9.77615 13.906 9.56247 13.906H1.74997V18.0126C1.74997 18.1061 1.78003 18.1829 1.84013 18.243C1.90023 18.3031 1.97703 18.3331 2.07052 18.3331ZM13.9294 19.8956H2.07052C1.54434 19.8956 1.09896 19.7133 0.734375 19.3487C0.369792 18.9842 0.1875 18.5388 0.1875 18.0126V1.98703C0.1875 1.46085 0.369792 1.01546 0.734375 0.650879C1.09896 0.286296 1.54434 0.104004 2.07052 0.104004H13.9294C14.4556 0.104004 14.901 0.286296 15.2656 0.650879C15.6302 1.01546 15.8124 1.46085 15.8124 1.98703V18.0126C15.8124 18.5388 15.6302 18.9842 15.2656 19.3487C14.901 19.7133 14.4556 19.8956 13.9294 19.8956Z"
          fill={isActive ? fill : "#999999"}
        />
      </svg>
    </>
  );
};

export const NoteStack = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="note_stack">
          <mask
            id="mask0_5449_110"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="24"
          >
            <rect id="Bounding box" x="0.5" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_5449_110)">
            <path
              id="note_stack_2"
              d="M7.49977 19.9998V8.97477C7.49977 8.42477 7.69977 7.9581 8.09977 7.57477C8.49977 7.19144 8.97477 6.99977 9.52477 6.99977H20.4998C21.0498 6.99977 21.5206 7.1956 21.9123 7.58727C22.3039 7.97894 22.4998 8.44977 22.4998 8.99977V16.9998L17.4998 21.9998H9.49977C8.94977 21.9998 8.47894 21.8039 8.08727 21.4123C7.6956 21.0206 7.49977 20.5498 7.49977 19.9998ZM2.52477 6.24977C2.42477 5.69977 2.5331 5.20394 2.84977 4.76227C3.16644 4.3206 3.59977 4.04977 4.14977 3.94977L14.9998 2.02477C15.5498 1.92477 16.0456 2.0331 16.4873 2.34977C16.9289 2.66644 17.1998 3.09977 17.2998 3.64977L17.5498 4.99977H15.4998L15.3248 3.99977L4.49977 5.92477L5.49977 11.5748V18.5498C5.2331 18.3998 5.00394 18.1998 4.81227 17.9498C4.6206 17.6998 4.49977 17.4164 4.44977 17.0998L2.52477 6.24977ZM9.49977 8.99977V19.9998H16.4998V15.9998H20.4998V8.99977H9.49977Z"
              fill={isActive ? fill : "#999999"}
            />
          </g>
        </g>
      </svg>
    </>
  );
};

export const Sell = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="sell">
          <mask
            id="mask0_5449_122"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="24"
          >
            <rect id="Bounding box" x="0.5" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_5449_122)">
            <path
              id="sell_2"
              d="M14.75 21.4C14.3667 21.7833 13.8917 21.975 13.325 21.975C12.7583 21.975 12.2833 21.7833 11.9 21.4L3.1 12.6C2.91667 12.4167 2.77083 12.2 2.6625 11.95C2.55417 11.7 2.5 11.4333 2.5 11.15V4C2.5 3.45 2.69583 2.97917 3.0875 2.5875C3.47917 2.19583 3.95 2 4.5 2H11.65C11.9333 2 12.2 2.05417 12.45 2.1625C12.7 2.27083 12.9167 2.41667 13.1 2.6L21.9 11.425C22.2833 11.8083 22.475 12.2792 22.475 12.8375C22.475 13.3958 22.2833 13.8667 21.9 14.25L14.75 21.4ZM13.325 20L20.475 12.85L11.65 4H4.5V11.15L13.325 20ZM7 8C7.41667 8 7.77083 7.85417 8.0625 7.5625C8.35417 7.27083 8.5 6.91667 8.5 6.5C8.5 6.08333 8.35417 5.72917 8.0625 5.4375C7.77083 5.14583 7.41667 5 7 5C6.58333 5 6.22917 5.14583 5.9375 5.4375C5.64583 5.72917 5.5 6.08333 5.5 6.5C5.5 6.91667 5.64583 7.27083 5.9375 7.5625C6.22917 7.85417 6.58333 8 7 8Z"
              fill={isActive ? fill : "#999999"}
            />
          </g>
        </g>
      </svg>
    </>
  );
};

export const Expense = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="arrow_outward">
          <mask
            id="mask0_5449_126"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="24"
          >
            <rect id="Bounding box" x="0.5" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_5449_126)">
            <path
              id="arrow_outward_2"
              d="M6.9 18L5.5 16.6L15.1 7H6.5V5H18.5V17H16.5V8.4L6.9 18Z"
              fill={isActive ? fill : "#999999"}
            />
          </g>
        </g>
      </svg>
    </>
  );
};

export const Income = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="arrow_outward">
          <mask
            id="mask0_5449_130"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="24"
          >
            <rect
              id="Bounding box"
              x="24.5"
              y="24"
              width="24"
              height="24"
              transform="rotate(180 24.5 24)"
              fill="#D9D9D9"
            />
          </mask>
          <g mask="url(#mask0_5449_130)">
            <path
              id="arrow_outward_2"
              d="M18.1 6L19.5 7.4L9.9 17H18.5V19H6.5V7H8.5V15.6L18.1 6Z"
              fill={isActive ? fill : "#999999"}
            />
          </g>
        </g>
      </svg>
    </>
  );
};

export const Donor = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="volunteer_activism">
          <mask
            id="mask0_5449_134"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="24"
          >
            <rect id="Bounding box" x="0.5" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_5449_134)">
            <path
              id="volunteer_activism_2"
              d="M16.5 13C15.7333 12.3 14.9875 11.6125 14.2625 10.9375C13.5375 10.2625 12.8958 9.6 12.3375 8.95C11.7792 8.3 11.3333 7.67083 11 7.0625C10.6667 6.45417 10.5 5.86667 10.5 5.3C10.5 4.36667 10.8167 3.58333 11.45 2.95C12.0833 2.31667 12.8667 2 13.8 2C14.3333 2 14.8333 2.1125 15.3 2.3375C15.7667 2.5625 16.1667 2.86667 16.5 3.25C16.8333 2.86667 17.2333 2.5625 17.7 2.3375C18.1667 2.1125 18.6667 2 19.2 2C20.1333 2 20.9167 2.31667 21.55 2.95C22.1833 3.58333 22.5 4.36667 22.5 5.3C22.5 5.86667 22.3333 6.45417 22 7.0625C21.6667 7.67083 21.2208 8.3 20.6625 8.95C20.1042 9.6 19.4667 10.2625 18.75 10.9375C18.0333 11.6125 17.2833 12.3 16.5 13ZM16.5 10.3C17.4833 9.36667 18.3958 8.4375 19.2375 7.5125C20.0792 6.5875 20.5 5.85 20.5 5.3C20.5 4.91667 20.3792 4.60417 20.1375 4.3625C19.8958 4.12083 19.5833 4 19.2 4C18.9667 4 18.7458 4.04583 18.5375 4.1375C18.3292 4.22917 18.15 4.36667 18 4.55L16.5 6.35L15 4.55C14.85 4.36667 14.6708 4.22917 14.4625 4.1375C14.2542 4.04583 14.0333 4 13.8 4C13.4167 4 13.1042 4.12083 12.8625 4.3625C12.6208 4.60417 12.5 4.91667 12.5 5.3C12.5 5.85 12.9208 6.5875 13.7625 7.5125C14.6042 8.4375 15.5167 9.36667 16.5 10.3ZM14.5 22.5L7.5 20.55V22H1.5V11H9.45L15.65 13.3C16.2 13.5 16.6458 13.85 16.9875 14.35C17.3292 14.85 17.5 15.4 17.5 16H19.5C20.3333 16 21.0417 16.275 21.625 16.825C22.2083 17.375 22.5 18.1 22.5 19V20L14.5 22.5ZM3.5 20H5.5V13H3.5V20ZM14.45 20.4L20.4 18.55C20.35 18.3667 20.2375 18.2292 20.0625 18.1375C19.8875 18.0458 19.7 18 19.5 18H14.7C14.1833 18 13.7167 17.9667 13.3 17.9C12.8833 17.8333 12.4333 17.7167 11.95 17.55L10.225 16.95L10.8 15.05L12.8 15.7C13.1 15.8 13.45 15.875 13.85 15.925C14.25 15.975 14.8 16 15.5 16C15.5 15.8167 15.4458 15.6417 15.3375 15.475C15.2292 15.3083 15.1 15.2 14.95 15.15L9.1 13H7.5V18.5L14.45 20.4Z"
              fill={isActive ? fill : "#999999"}
            />
          </g>
        </g>
      </svg>
    </>
  );
};

export const History = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="history">
          <mask
            id="mask0_5449_138"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="24"
          >
            <rect id="Bounding box" x="0.5" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_5449_138)">
            <path
              id="history_2"
              d="M12.5 21C10.2 21 8.19583 20.2375 6.4875 18.7125C4.77917 17.1875 3.8 15.2833 3.55 13H5.6C5.83333 14.7333 6.60417 16.1667 7.9125 17.3C9.22083 18.4333 10.75 19 12.5 19C14.45 19 16.1042 18.3208 17.4625 16.9625C18.8208 15.6042 19.5 13.95 19.5 12C19.5 10.05 18.8208 8.39583 17.4625 7.0375C16.1042 5.67917 14.45 5 12.5 5C11.35 5 10.275 5.26667 9.275 5.8C8.275 6.33333 7.43333 7.06667 6.75 8H9.5V10H3.5V4H5.5V6.35C6.35 5.28333 7.3875 4.45833 8.6125 3.875C9.8375 3.29167 11.1333 3 12.5 3C13.75 3 14.9208 3.2375 16.0125 3.7125C17.1042 4.1875 18.0542 4.82917 18.8625 5.6375C19.6708 6.44583 20.3125 7.39583 20.7875 8.4875C21.2625 9.57917 21.5 10.75 21.5 12C21.5 13.25 21.2625 14.4208 20.7875 15.5125C20.3125 16.6042 19.6708 17.5542 18.8625 18.3625C18.0542 19.1708 17.1042 19.8125 16.0125 20.2875C14.9208 20.7625 13.75 21 12.5 21ZM15.3 16.2L11.5 12.4V7H13.5V11.6L16.7 14.8L15.3 16.2Z"
              fill={isActive ? fill : "#999999"}
            />
          </g>
        </g>
      </svg>
    </>
  );
};

export const Build = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="build">
          <mask
            id="mask0_5449_150"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="24"
          >
            <rect id="Bounding box" x="0.5" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_5449_150)">
            <path
              id="build_2"
              d="M17.65 20.7L11.6 14.6C11.2667 14.7333 10.9292 14.8333 10.5875 14.9C10.2458 14.9667 9.88333 15 9.5 15C7.83333 15 6.41667 14.4167 5.25 13.25C4.08333 12.0833 3.5 10.6667 3.5 9C3.5 8.4 3.58333 7.82917 3.75 7.2875C3.91667 6.74583 4.15 6.23333 4.45 5.75L8.1 9.4L9.9 7.6L6.25 3.95C6.73333 3.65 7.24583 3.41667 7.7875 3.25C8.32917 3.08333 8.9 3 9.5 3C11.1667 3 12.5833 3.58333 13.75 4.75C14.9167 5.91667 15.5 7.33333 15.5 9C15.5 9.38333 15.4667 9.74583 15.4 10.0875C15.3333 10.4292 15.2333 10.7667 15.1 11.1L21.2 17.15C21.4 17.35 21.5 17.5917 21.5 17.875C21.5 18.1583 21.4 18.4 21.2 18.6L19.1 20.7C18.9 20.9 18.6583 21 18.375 21C18.0917 21 17.85 20.9 17.65 20.7ZM18.375 18.575L19.05 17.9L12.65 11.5C12.95 11.1667 13.1667 10.7792 13.3 10.3375C13.4333 9.89583 13.5 9.45 13.5 9C13.5 8 13.1792 7.12917 12.5375 6.3875C11.8958 5.64583 11.1 5.2 10.15 5.05L12 6.9C12.2 7.1 12.3 7.33333 12.3 7.6C12.3 7.86667 12.2 8.1 12 8.3L8.8 11.5C8.6 11.7 8.36667 11.8 8.1 11.8C7.83333 11.8 7.6 11.7 7.4 11.5L5.55 9.65C5.7 10.6 6.14583 11.3958 6.8875 12.0375C7.62917 12.6792 8.5 13 9.5 13C9.93333 13 10.3667 12.9333 10.8 12.8C11.2333 12.6667 11.625 12.4583 11.975 12.175L18.375 18.575Z"
              fill={isActive ? fill : "#999999"}
            />
          </g>
        </g>
      </svg>
    </>
  );
};

export const Admission = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_12836_14273)">
          <path
            d="M18.1481 9.25921H16.6666V7.77773C16.6666 7.58127 16.5886 7.39286 16.4496 7.25395C16.3107 7.11503 16.1223 7.03699 15.9259 7.03699C15.7294 7.03699 15.541 7.11503 15.4021 7.25395C15.2632 7.39286 15.1851 7.58127 15.1851 7.77773V9.25921H13.7036C13.5072 9.25921 13.3188 9.33725 13.1798 9.47617C13.0409 9.61508 12.9629 9.80349 12.9629 9.99995C12.9629 10.1964 13.0409 10.3848 13.1798 10.5237C13.3188 10.6626 13.5072 10.7407 13.7036 10.7407H15.1851V12.2222C15.1851 12.4186 15.2632 12.607 15.4021 12.746C15.541 12.8849 15.7294 12.9629 15.9259 12.9629C16.1223 12.9629 16.3107 12.8849 16.4496 12.746C16.5886 12.607 16.6666 12.4186 16.6666 12.2222V10.7407H18.1481C18.3445 10.7407 18.5329 10.6626 18.6719 10.5237C18.8108 10.3848 18.8888 10.1964 18.8888 9.99995C18.8888 9.80349 18.8108 9.61508 18.6719 9.47617C18.5329 9.33725 18.3445 9.25921 18.1481 9.25921Z"
            fill={isActive ? fill : "#999999"}
          />
          <path
            d="M7.77794 9.99998C8.65697 9.99998 9.51626 9.73931 10.2471 9.25095C10.978 8.76259 11.5477 8.06846 11.8841 7.25635C12.2205 6.44423 12.3085 5.5506 12.137 4.68846C11.9655 3.82632 11.5422 3.0344 10.9206 2.41283C10.2991 1.79127 9.50715 1.36797 8.64501 1.19648C7.78287 1.02499 6.88924 1.11301 6.07713 1.4494C5.26501 1.78579 4.57088 2.35544 4.08252 3.08633C3.59416 3.81721 3.3335 4.6765 3.3335 5.55553C3.33467 6.73391 3.8033 7.86369 4.63654 8.69693C5.46978 9.53017 6.59956 9.9988 7.77794 9.99998ZM7.77794 2.59257C8.36396 2.59257 8.93682 2.76634 9.42408 3.09192C9.91133 3.41749 10.2911 3.88024 10.5154 4.42165C10.7396 4.96306 10.7983 5.55882 10.684 6.13358C10.5696 6.70833 10.2875 7.23628 9.87307 7.65066C9.45869 8.06504 8.93075 8.34724 8.35599 8.46156C7.78123 8.57589 7.18548 8.51721 6.64406 8.29295C6.10265 8.06869 5.6399 7.68892 5.31433 7.20166C4.98875 6.71441 4.81498 6.14155 4.81498 5.55553C4.81498 4.7697 5.12715 4.01606 5.68281 3.4604C6.23847 2.90474 6.99211 2.59257 7.77794 2.59257Z"
            fill={isActive ? fill : "#999999"}
          />
          <path
            d="M7.77799 11.4814C6.01049 11.4834 4.31593 12.1864 3.06611 13.4362C1.8163 14.686 1.11329 16.3806 1.11133 18.1481C1.11133 18.3446 1.18937 18.533 1.32829 18.6719C1.4672 18.8108 1.65561 18.8889 1.85207 18.8889C2.04853 18.8889 2.23694 18.8108 2.37585 18.6719C2.51477 18.533 2.59281 18.3446 2.59281 18.1481C2.59281 16.7729 3.1391 15.454 4.11152 14.4816C5.08393 13.5092 6.4028 12.9629 7.77799 12.9629C9.15319 12.9629 10.4721 13.5092 11.4445 14.4816C12.4169 15.454 12.9632 16.7729 12.9632 18.1481C12.9632 18.3446 13.0412 18.533 13.1801 18.6719C13.3191 18.8108 13.5075 18.8889 13.7039 18.8889C13.9004 18.8889 14.0888 18.8108 14.2277 18.6719C14.3666 18.533 14.4447 18.3446 14.4447 18.1481C14.4427 16.3806 13.7397 14.686 12.4899 13.4362C11.2401 12.1864 9.5455 11.4834 7.77799 11.4814Z"
            fill={isActive ? fill : "#999999"}
          />
        </g>
        <defs>
          <clipPath id="clip0_12836_14273">
            <rect width="17.7778" height="17.7778" fill="white" transform="translate(1.11108 1.11108)" />
          </clipPath>
        </defs>
      </svg>
{/*       
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          fill={isActive ? fill : "#999999"}
          d="M2.125 2.317a1.95 1.95 0 011.95-1.95h14a1.95 1.95 0 011.95 1.95v8.725a4.473 4.473 0 00-1.9-.692V2.317a.05.05 0 00-.05-.05h-14a.05.05 0 00-.05.05v16c0 .028.022.05.05.05h9.792c.323.47.734.875 1.208 1.192v.708h-11a1.95 1.95 0 01-1.95-1.95v-16z"
          clipRule="evenodd"
        ></path>
        <path
          fill={isActive ? fill : "#999999"}
          stroke={isActive ? fill : "#999999"}
          strokeLinecap="round"
          strokeWidth="1.5"
          d="M6.875 5.617h7.5M6.875 8.617h7.5M6.875 11.617h5"
        ></path>
        <path
          fill={isActive ? fill : "#999999"}
          d="M20.4 18.364a4.508 4.508 0 01-1.4.962v2.442l-1.605-.467-.195-.057-.195.057-1.605.467v-2.442a4.508 4.508 0 01-1.4-.962v5.269l.896-.26 2.304-.67 2.305.67.895.26v-5.269z"
          clipRule="evenodd"
        ></path>
        <circle stroke={isActive ? fill : "#999"} cx="17.375" cy="15.117" r="4.5" strokeWidth="1.5"></circle>
        <path
          stroke={isActive ? fill : "#999"}
          strokeLinecap="round"
          strokeWidth="1.2"
          d="M15.875 15.617l1.286 1 1.714-3"
        ></path>
      </svg> */}
    </>
  );
};

export const Transfer = ({ fill, isActive }: { fill: string; isActive: boolean }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          fill={isActive ? fill : "#999999"}
          d="M2.125 2.317a1.95 1.95 0 011.95-1.95h14a1.95 1.95 0 011.95 1.95v8.725a4.473 4.473 0 00-1.9-.692V2.317a.05.05 0 00-.05-.05h-14a.05.05 0 00-.05.05v16c0 .028.022.05.05.05h9.792c.323.47.734.875 1.208 1.192v.708h-11a1.95 1.95 0 01-1.95-1.95v-16z"
          clipRule="evenodd"
        ></path>
        <path
          fill={isActive ? fill : "#999999"}
          stroke={isActive ? fill : "#999999"}
          strokeLinecap="round"
          strokeWidth="1.5"
          d="M6.875 5.617h7.5M6.875 8.617h7.5M6.875 11.617h5"
        ></path>
        <path
          fill={isActive ? fill : "#999999"}
          d="M20.4 18.364a4.508 4.508 0 01-1.4.962v2.442l-1.605-.467-.195-.057-.195.057-1.605.467v-2.442a4.508 4.508 0 01-1.4-.962v5.269l.896-.26 2.304-.67 2.305.67.895.26v-5.269z"
          clipRule="evenodd"
        ></path>
        <circle stroke={isActive ? fill : "#999"} cx="17.375" cy="15.117" r="4.5" strokeWidth="1.5"></circle>
        <path
          stroke={isActive ? fill : "#999"}
          strokeLinecap="round"
          strokeWidth="1.2"
          d="M15.875 15.617l1.286 1 1.714-3"
        ></path>
      </svg>
    </>
  );
};