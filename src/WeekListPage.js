import WeekList from "./WeekList";
import { useParams } from "react-router-dom"
import useFetch from "./hooks/useFetch";
import config from "./config.json"

const WeekListPage = () => {
    // fetch the weeklist data
    const { id } = useParams();
    const fetchResult = useFetch(config.DATA_SERVER_URL + `/weekLists/${id}`);

    return <div className="weekListPage">
        <WeekList
            weekListId={id}
            initialData={fetchResult}
        />
    </div>
}

export default WeekListPage;