export const getTransactionIcon = (type: string | null) => {
  switch (type) {
    case 'sus':
      return (
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="44" height="44" rx="12" fill="#F3E4FF" />
          <path
            d="M24 18H21V24H16V18H13L18.5 12L24 18ZM25.5 32L31 26H28V20H23V26H20L25.5 32Z"
            fill="#B946FF"
          />
        </svg>
      );
    case 'cashin':
      return (
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="44" height="44" rx="12" fill="#E4FFF0" />
          <path
            d="M19 14H25V22H29.84L22 29.84L14.16 22H19V14Z"
            fill="#74CC9B"
          />
        </svg>
      );
    case 'cashout':
      return (
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="44" height="44" rx="12" fill="#FEEAD4" />
          <path
            d="M25 30L19 30L19 22L14.16 22L22 14.16L29.84 22L25 22L25 30Z"
            fill="#EF9C55"
          />
        </svg>
      );
    default:
      return null;
  }
};

export const getIssuerIcon = (type: string) => {
  switch (type) {
    case 'MASTERCARD':
      return (
        <svg
          width="35"
          height="25"
          viewBox="0 0 35 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12.2229" cy="12.2229" r="12.2229" fill="#E9231A" />
          <circle
            opacity="0.8"
            cx="21.7885"
            cy="12.2229"
            r="12.2229"
            fill="#E99418"
          />
        </svg>
      );
    case 'VISA':
      return (
        <svg
          width="35"
          height="25"
          viewBox="0 0 35 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M31.25 21.875C31.25 23.255 30.13 24.375 28.75 24.375H6.25C4.87 24.375 3.75 23.255 3.75 21.875V8.125C3.75 6.745 4.87 5.625 6.25 5.625H28.75C30.13 5.625 31.25 6.745 31.25 8.125V21.875Z"
            fill="#2100C4"
          />
          <path
            d="M11.491 11.875L9.725 16.77C9.725 16.77 9.308 14.699 9.267 14.439C8.332 12.307 6.954 12.426 6.954 12.426L8.579 18.75V18.749H10.554L13.411 11.875H11.491ZM13.056 18.75H14.85L15.935 11.875H14.118L13.056 18.75ZM27.005 11.875H25.116L22.173 18.75H24.018L24.386 17.768H26.633L26.824 18.75H28.495L27.005 11.875ZM24.883 16.455L25.856 13.857L26.371 16.455H24.883ZM18.48 13.879C18.48 13.5 18.792 13.218 19.684 13.218C20.264 13.218 20.929 13.639 20.929 13.639L21.22 12.196C21.22 12.196 20.371 11.874 19.537 11.874C17.651 11.874 16.678 12.777 16.678 13.92C16.678 15.986 19.198 15.702 19.198 16.764C19.198 16.946 19.052 17.366 18.01 17.366C16.965 17.366 16.261 16.986 16.261 16.986L15.951 18.371C15.951 18.371 16.614 18.75 17.926 18.75C19.241 18.75 21.039 17.787 21.039 16.404C21.039 14.741 18.48 14.621 18.48 13.879Z"
            fill="white"
          />
          <path
            d="M9.632 15.591L9.029 12.623C9.029 12.623 8.756 11.98 8.052 11.98C7.348 11.98 5.395 11.98 5.395 11.98C5.395 11.98 8.859 13.025 9.632 15.591Z"
            fill="#F5BC00"
          />
        </svg>
      );
    default:
      return null;
  }
};
