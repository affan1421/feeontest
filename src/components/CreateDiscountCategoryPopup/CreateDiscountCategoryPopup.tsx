import React, { useEffect, useState } from 'react';
import { IconButton, InputBase, Paper, TextareaAutosize } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Discount } from '@/models/Discount';
import styles from './CreateDiscountCategoryPopup.module.css';
import { DiscountSchema } from '@/FormSchema/FormValidation';
import api from '@/store/api';
import { useParams } from 'react-router-dom';


interface Props {
  setDialog: (state: boolean) => void
  discount?: Discount
}

const CreateDiscountCategory = (props: Props) => {

  const { discountId } = useParams()

  // API's
  const createDiscountAPI = api((state) => state.createDiscount)
  const updateDiscountCategoryAPI = api((state) => state.updateDiscountCategory)
  const setError = api((state) => state.setError)

  const [discount, setDiscount] = useState<Discount>({
    name: '',
    description: '',
    totalBudget: null,
    createdBy: localStorage.getItem('user_id') as string,
    schoolId: localStorage.getItem('school_id') as string,
  });

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount({
      ...discount,
      name: event.target.value,
    });
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDiscount({
      ...discount,
      description: event.target.value,
    });
  };

  const handleBudgetAllocatedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Math.sign(Number(event.target.value)) == 1 || Math.sign(Number(event.target.value)) == 0) {
      setDiscount({
        ...discount,
        totalBudget: event.target.value ? Number(event.target.value) : null,
        budgetRemaining: Number(event.target.value)
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await DiscountSchema.validate(discount, { abortEarly: false });
      createDiscountAPI(discount).then((response: any) => {
        if (response.status == 201) {
          setDiscount({
            name: '',
            description: '',
            totalBudget: 0,
            budgetRemaining: 0,
          })
          props.setDialog(false)
        }
      })
    } catch (error: any) {
      const errorMessage = error.errors.join('\n');
      setError(true, errorMessage);
      setTimeout(() => {
        setError(false, '');
      }, 2000)
    }
  }

  const handleUpdate = async () => {
    try {
      await DiscountSchema.validate(discount, { abortEarly: false });
      updateDiscountCategoryAPI(discountId as string, discount).then((response: any) => {
        if (response.status == 200) {
          setDiscount({
            name: '',
            description: '',
            totalBudget: 0,
            budgetRemaining: 0,
          })
          props.setDialog(false)
        }
      })
    } catch (error: any) {
      const errorMessage = error.errors.join('\n');
      setError(true, errorMessage);
      setTimeout(() => {
        setError(false, '');
      }, 2000)
    }
  }

  useEffect(() => {
    if (props.discount) {
      setDiscount(props.discount)
    }
  }, [props.discount])

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <span className={styles.title}>{props.discount ? 'Update' : 'Add'} Discount Category</span>
        <IconButton
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
          onClick={() => {
            props.setDialog(false)
          }}
        >
          <Close />
        </IconButton>
      </div>
      <div className={styles.form}>
        <div className={styles.form_item}>
          <label>
            <b>Name</b>
          </label>
          <Paper className={styles.input}>
            <InputBase
              placeholder='Name'
              id='filled-hidden-label-small'
              size='small'
              className={styles.input_input}
              value={discount.name}
              onChange={handleNameChange}
            />
          </Paper>
        </div>
        <div className={styles.form_item}>
          <label>
            <b>Description</b>
          </label>
          <Paper className={styles.input_desc}>
            <TextareaAutosize
              placeholder='Description'
              id='filled-hidden-label-small'
              className={styles.input_input_desc}
              value={discount.description}
              onChange={handleDescriptionChange}
            />
          </Paper>
        </div>
        <div className={styles.form_item}>
          <label>
            <b>Budget Allocated</b>
          </label>
          <Paper className={styles.input}>
            <InputBase
              type='number'
              placeholder='0'
              id='filled-hidden-label-small'
              size='small'
              className={styles.input_input}
              value={discount.totalBudget}
              onChange={handleBudgetAllocatedChange}
            />
          </Paper>
        </div>
      </div>
      <div className={styles.footer}>
        {
          props.discount ?
            <button onClick={handleUpdate}>Update</button> :
            <button onClick={handleSubmit}>Save</button>
        }
      </div>
    </div>
  );
};

export default CreateDiscountCategory;
