import { useParams } from "react-router-dom"
import WeekList from "../components/weekList/WeekList";

const WeekListPage = () => {
    const { id } = useParams();

    return <div className="weekListPage">
        <WeekList
            weekListId={id}
        />
    </div>
}

export default WeekListPage;