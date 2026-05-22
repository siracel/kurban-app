import HisseGroupList from "./HisseGroupList";
import Card from "../../../components/Card";
import PageHeader from "../../../components/PageHeader";

function HisseGroup() {
    return (
      <>
        <PageHeader
          title="Hisse Grupları"
          actionLabel="Hisse Grubu Oluştur+"
          actionTo="/kurum/create-hisse-grup"
        />

        <Card className="!p-0 overflow-hidden">
          <HisseGroupList />
        </Card>
      </>
    );
}

export default HisseGroup;