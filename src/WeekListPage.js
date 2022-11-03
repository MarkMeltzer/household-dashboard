import WeekList from "./WeekList";
import { useParams } from "react-router-dom"
import useFetch from "./hooks/useFetch";
import config from "./config.json"

const WeekListPage = () => {
    const { id } = useParams();

    return <div className="weekListPage">
        <WeekList
            weekListId={id}
        />
    </div>
}

export default WeekListPage;