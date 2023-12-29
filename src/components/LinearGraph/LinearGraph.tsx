import GraphComponent from '../GraphComponent/GraphComponent'
import styles from './LinearGraph.module.css'
import income_icon from '@/assests/income_icon.svg'
import expense_icon from '@/assests/expense_icon.svg'
import income_up_arrow from '@/assests/income_arrow.svg'
import expense_up_arrow from '@/assests/expense_arrow.svg'
import income_down_arrow from '@/assests/income_down_arrow.svg'
import expense_down_arrow from '@/assests/expense_down_arrow.svg'
import { formatter } from '@/helpers/formatter'

interface LinearGraph {
    title: string
    amount: number
    percentage?: number
    data: number[]
    topColor: string
    bottomColor: string
    borderColor: string
    isIncome?: boolean
    isExpense?: boolean
    graphHeight?: number
    labels: string[]
    amountEnabled: boolean

    titleFontSize?: number
    amountFontSize?: number
}

const LinearGraph = (props: LinearGraph) => {
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div>
                    {props.isIncome && <img src={income_icon} />}
                    {props.isExpense && <img src={expense_icon} />}
                </div>
                <span
                    style={{ fontSize: props.titleFontSize ? props.titleFontSize : 24 }}
                    className={styles.title}
                >{props.title}</span>
            </div>
            {
                props.data && props.data.length > 0 && props.labels.length > 0 && props.data.length === props.labels.length ?
                    <GraphComponent
                        labels={props.labels ? props.labels : []}
                        graphHeight={props.graphHeight}
                        topColor={props.topColor}
                        bottomColor={props.bottomColor}
                        borderColor={props.borderColor}
                        data={props.data ? props.data : []}
                    />
                    :
                    <div className={styles.noData}>
                        No Data
                    </div>
            }

            <div className={styles.footer}>
                <span
                    style={{ fontSize: props.amountFontSize ? props.amountFontSize : 34 }}
                    className={styles.amount}
                >{props.amountEnabled ? `${formatter(props.amount)}` : ''}</span>
                {props.percentage ?
                    <span className={styles.percentage}>
                        <img src={props.isIncome ?
                            Number(props.percentage) > 0 ? income_up_arrow : income_down_arrow :
                            Number(props.percentage) > 0 ? expense_up_arrow : expense_down_arrow
                        } />
                        &nbsp;
                        {
                            props.percentage ?
                                (props.percentage).toFixed(2)
                                : 0
                        }%
                    </span> : ''}
            </div>
        </div >
    )
}

export default LinearGraph