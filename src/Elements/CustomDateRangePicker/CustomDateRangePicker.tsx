
import { DateRangePicker } from '@react-spectrum/datepicker'
import { Provider, defaultTheme } from "@adobe/react-spectrum";
import styles from "./CustomDateRangePicker.module.css";

// import { DateRangePicker } from "rsuite";

// import 'rsuite/dist/rsuite.min.css';

interface Props {
  range?: any;
  setRange: React.Dispatch<React.SetStateAction<any>>;
}

const CustomDateRangePicker = ({ range, setRange }: Props) => {
  return (
    <div className={styles.main}>
      <Provider theme={defaultTheme} locale="en-GB" colorScheme="light" defaultColorScheme="light">
        <DateRangePicker
          shouldForceLeadingZeros
          value={range}
          onChange={setRange}
          width={300}
          aria-label="Choose a date range"
        />
      </Provider>
    </div>
  );
};

export default CustomDateRangePicker;

// import { DateRangePicker } from '@react-spectrum/datepicker'
// import { Provider, defaultTheme } from '@adobe/react-spectrum';
// import styles from './CustomDateRangePicker.module.css'

// interface Props {
//     range?: any
//     setRange: React.Dispatch<React.SetStateAction<any>>
// }

// const CustomDateRangePicker = ({ range, setRange }: Props) => {
//     return (
//         <div className={styles.main}>
//             <Provider theme={defaultTheme} colorScheme="light" defaultColorScheme='light'>
//                 <DateRangePicker
//                     shouldForceLeadingZeros
//                     value={range}
//                     onChange={setRange}
//                     width={300}
//                     aria-label="Choose a date range"
//                 />
//             </Provider>
//         </div>
//     )
// }

// export default CustomDateRangePicker;
