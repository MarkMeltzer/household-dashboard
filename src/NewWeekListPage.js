import WeekList from "./WeekList";

const NewWeekListPage = () => {
    return <div className="weekListPage">
        <WeekList 
            isEditing={true}
        />
    </div>
}

export default NewWeekListPage;