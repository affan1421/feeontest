import { useEffect, useState } from 'react';
import { TabContext, TabPanel } from '@mui/lab';
import { Tabs, Tab, Dialog, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DiscountCategoryCard from '../DiscountCategoryCard/DiscountCategoryCard';
import DiscountStatsCard from '../DiscountStatsCard/DiscountStatsCard';
import DiscountGraph from '../DiscountGraph/DiscountGraph';
import DiscountStudentList from '../DiscountStudentList/DiscountStudentList';
import DiscountClassCard from '../DiscountClassCard/DiscountClassCard';
import CreateDiscountCategory from '../CreateDiscountCategoryPopup/CreateDiscountCategoryPopup';
import api from '@/store/api';
import { formatter } from '@/helpers/formatter';
import styles from './NewDiscount.module.css';
import DiscountRequestList from '../DiscountRequestList/DiscountRequestList';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface DiscountCategory {
  name: string;
  amount: number;
}

interface ClassStats {
  name: string;
  _id: string;
  totalDiscount: number;
  discountCategories: DiscountCategory[];
}

interface Stats {
  totalBudgetAlloted: number;
  totalDiscount: number;
  totalBudgetRemaining: number;
}

interface GraphItem {
  name: string,
  amount: number
}

interface DiscountCategoryCard {
  _id: string;
  name: string;
  totalBudget: number;
  budgetAlloted: number;
  budgetRemaining: number;
  totalDiscount: number;
}

const NewDiscount = () => {
  const role = localStorage.getItem('role_name');
  const schoolId = localStorage.getItem('school_id') as string;
  const navigate = useNavigate();

  const getDiscountSummaryAPI = api(state => state.getDiscountSummary);
  const getDiscountCategoryGraphAPI = api(state => state.getDiscountCategoryGraph);
  const getClassGraphAPI = api(state => state.getClassGraph);
  const getDiscountTypesAPI = api(state => state.getDiscountTypes);
  const getSectionWiseDataAPI = api(state => state.getSectionWiseData);

  const [value, setValue] = useState('1');
  const [stats, setStats] = useState<Stats>({
    totalBudgetAlloted: 0,
    totalBudgetRemaining: 0,
    totalDiscount: 0
  })

  // class pagination
  // const classItemsPerPage = 4;
  // const [currentClassPage, setCurrentClassPage] = useState(1);
  // const lastClassIndex = currentClassPage * classItemsPerPage;
  // const firstClassIndex = lastClassIndex - classItemsPerPage;

  // discount pagination
  // const discountItemsPerPage = 4;
  // const [currentDiscountPage, setCurrentDiscountPage] = useState(1);
  // const lastDiscountIndex = currentDiscountPage * discountItemsPerPage;
  // const firstDiscountIndex = lastDiscountIndex - discountItemsPerPage;

  const [discountGraphs, setDiscountGraphs] = useState<GraphItem[]>([])
  const [classGraphs, setClassGraphs] = useState<GraphItem[]>([])
  const [data, setData] = useState<ClassStats[]>([]);
  const [discountCategoryCards, setDiscountCategoryCards] = useState<DiscountCategoryCard[]>([])
  const [dialog, setDialog] = useState(false);
  // const itemsToShow = data.slice(firstClassIndex, lastClassIndex);


  const getSectionCardData = () => {
    getSectionWiseDataAPI(0, 10).then(response => {
      if (response.status === 200) {
        setData(response.data.data);
      }
    });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue == '2') {
      getClassGraph()
      getSectionCardData();
    }
  };


  // const handlePageChange = (newPage: number) => {
  //   setCurrentClassPage(newPage);
  //   getSectionWiseDataAPI(newPage, classItemsPerPage).then(response => {
  //     if (response.status === 200) {
  //       console.log(response.data.data);
  //       setData(response.data.data);
  //     }
  //   });

  // };

  // const handleDiscountPageChange = (newPage: number) => {
  //   setCurrentDiscountPage(newPage);
  //   getDiscountTypesAPI(schoolId, newPage, discountItemsPerPage).then(response => {
  //     if (response.status === 200) {
  //       setDiscountCategoryCards(response.data.data)
  //     }
  //   });

  // };

  const handleClose = () => {
    setDialog(false);
  };


  const getDiscountSummary = () => {
    getDiscountSummaryAPI().then(response => {
      if (response.status === 200) {
        setStats(response.data.data);
      }
    });
  };

  const getDiscountCategoryGraph = () => {
    getDiscountCategoryGraphAPI().then(response => {
      if (response.status === 200) {
        setDiscountGraphs(response.data.data)
      }
    });
  };

  const getClassGraph = () => {
    getClassGraphAPI().then(response => {
      if (response.status === 200) {
        setClassGraphs(response.data.data)
      }
    });
  };

  const getDiscountTypes = () => {
    getDiscountTypesAPI(schoolId, 0, 20).then(response => {
      if (response.status === 200) {
        setDiscountCategoryCards(response.data.data)
      }
    });
  };



  useEffect(() => {
    getDiscountSummary()
    getDiscountCategoryGraph()
    getDiscountTypes()
  }, []);

  useEffect(() => {
    getDiscountTypes()
  }, [dialog])

  // useEffect(() => {
  //   getSectionCardData();
  // }, [currentClassPage]);

  // useEffect(() => {
  //   getDiscountTypes();
  // }, [currentDiscountPage]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.heading}>
            <h1>Discount</h1>
          </div>
          <div className={styles.actions}>
            {role === 'management' && (
              <button
                className={styles.category}
                onClick={() => {
                  setDialog(true);
                }}
              >
                Add Category
              </button>
            )}
            <button
              className={styles.discount}
              onClick={() => {
                navigate('/give-discount');
              }}
            >
              Give Discount
            </button>
          </div>
        </div>
        <div className={styles.cards}>
          <DiscountStatsCard
            title={'Total Discount'}
            amount={stats?.totalDiscount}
            isCurrency={true}
          />
          <DiscountStatsCard
            title={'Budget Alloted'}
            amount={stats?.totalBudgetAlloted}
            isCurrency={true}
          />
          <DiscountStatsCard
            title={'Budget Remaining'}
            amount={stats?.totalBudgetRemaining}
            isCurrency={true}
          />
        </div>
        <div className={styles.tabs}>
          <TabContext value={value}>
            <div style={{ marginLeft: '20px' }}>
              <Tabs value={value} onChange={handleChange}>
                <Tab label="Discount Category" className={styles.tab} value="1" />
                <Tab label="Classes" className={styles.tab} value="2" />
                <Tab label="Students" className={styles.tab} value="3" />
                {role === 'management' && (
                  <Tab label="Discount Request" className={styles.tab} value="4" />
                )}
              </Tabs>
            </div>
            <TabPanel value="1">
              <div className={styles.graph}>
                <h1 className={styles.graphTitle}>Discount Categories</h1>
                <DiscountGraph isclass={false} labels={discountGraphs.map(item => item.name) as string[]} data={discountGraphs.map(item => item.amount) as number[]} />
              </div>
              <div className={styles.row}>
                {discountCategoryCards.length > 0 &&
                  discountCategoryCards.map((discountCategory: DiscountCategoryCard) => {
                    
                    return <DiscountCategoryCard
                      id={discountCategory._id}
                      key={discountCategory._id}
                      title={discountCategory.name}
                      totalDiscount={formatter(discountCategory.totalDiscount)}
                      totalBudget={formatter(discountCategory.totalBudget)}
                      remainingAmount={formatter(discountCategory.budgetRemaining)}
                    />
                  })
                }
              </div>
              {discountCategoryCards.length == 0 &&
                <div className={styles.nodata}>
                  <span>No Discount Category Found</span>
                </div>
              }
              {/* <div className={styles.pagination}>
                <IconButton
                  onClick={() => handleDiscountPageChange(currentDiscountPage - 1)}
                  disabled={currentDiscountPage === 1}
                >
                  <ArrowBackIosIcon />
                </IconButton>

                <IconButton
                  onClick={() => handleDiscountPageChange(currentDiscountPage + 1)}
                  disabled={lastDiscountIndex > discountCategoryCards.length}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </div> */}
            </TabPanel>
            <TabPanel value="2">
              <div className={styles.graph}>
                <h1 className={styles.graphTitle}>Classes</h1>
                <DiscountGraph isclass={true} labels={classGraphs.map(item => item.name) as string[]} data={classGraphs.map(item => item.amount) as number[]} />
              </div>
              <div className={styles.class}>
                {data.length > 0 && data.map((item) => (
                  <DiscountClassCard
                    key={item._id}
                    discountCategories={item.discountCategories}
                    id={item._id}
                    name={item.name}
                    totalDiscount={item.totalDiscount}
                  />
                ))}
              </div>
              {data.length == 0 &&
                <div className={styles.nodata}>
                  <span>No Classes Found</span>
                </div>
              }
              {/* <div className={styles.pagination}>
                <IconButton
                  onClick={() => handlePageChange(currentClassPage - 1)}
                  disabled={currentClassPage === 1}
                >
                  <ArrowBackIosIcon />
                </IconButton>

                <IconButton
                  onClick={() => handlePageChange(currentClassPage + 1)}
                  disabled={lastClassIndex > data.length}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </div> */}
            </TabPanel>
            <TabPanel value="3">
              <DiscountStudentList />
            </TabPanel>
            {role === 'management' && (
              <TabPanel value="4">
                <DiscountRequestList isClass={false} isDiscount={false} />
              </TabPanel>
            )}
          </TabContext>
        </div>
        <Dialog open={dialog} maxWidth="xl" onClose={handleClose}>
          <CreateDiscountCategory setDialog={handleClose} />
        </Dialog>
      </div>
    </>
  );
};

export default NewDiscount;
