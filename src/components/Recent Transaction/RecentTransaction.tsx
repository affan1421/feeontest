import styles from "./RecentTransaction.module.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import user from "../../assests/user.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StudentTransaction } from "@/models/StudentTransaction";
import TablePagination from '@mui/material/TablePagination';
import { SetStateAction, useState } from "react";

interface RecentTransaction {
  studentTransaction: StudentTransaction[];
}



const RecentTransaction = (props: RecentTransaction) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setPage(newPage);
  };

  const navigate = useNavigate();
  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Recent Transaction</span>
        </div>
        <div className={styles.main}>
          {props.studentTransaction.length > 0 ? (
            <div
              style={{
                display: 'flex',
                height: '95%',
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <div>
                {props.studentTransaction.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: StudentTransaction) => (
                  <List
                    sx={{ width: "100%", bgcolor: "background.paper" }}
                  >
                    <ListItem
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                      key={item?._id}>
                      <ListItemAvatar>
                        <Avatar src={user} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<>{item?.studentId?.name}</>}
                        secondary={
                          <>
                            <div className={styles.status}>
                              <div className={styles.approved}>
                                Paid {formatter.format(item?.paidAmount)}
                              </div>

                              {item.dueAmount ? (
                                <> -
                                  <div className={styles.pending}>
                                    Due {formatter.format(item?.dueAmount)}
                                  </div>
                                </>
                              ) : null}

                            </div>
                            <div className={styles.date}>
                              {new Date(item?.date).toLocaleDateString(
                                "en-US",
                                options
                              ) === new Date().toLocaleDateString("en-US", options)
                                ? "Today"
                                : new Date(item.date).toLocaleDateString(
                                  "en-US",
                                  options
                                )}
                            </div>
                          </>
                        }
                      />
                      <IconButton
                        onClick={() => {
                          navigate(`/pay/${item?.studentId?._id}/true`);
                        }}
                        sx={{
                          border: "1.5px solid #DBDBDB",
                          borderRadius: "04px",
                          marginTop: "10px",
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </ListItem>
                  </List>
                ))}
              </div>
              <TablePagination
                component="div"
                count={props.studentTransaction.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[]}
                labelDisplayedRows={() => ''}
              />
            </div>
          ) : (
            <div className={styles.nodata}>No recent transactions</div>
          )}


        </div>
      </div>
    </>
  );
};

export default RecentTransaction;
