import ProcessList from "./ProcessList";
import Card from "../../../components/Card";
import PageHeader from "../../../components/PageHeader";

function Process() {
    return (
      <>
        <PageHeader
          title="İşlem Adımları"
          actionLabel="İşlem Adımı Oluştur+"
          actionTo="/kurum/create-process"
        />

        <Card className="!p-0 overflow-hidden">
          <ProcessList />
        </Card>
      </>
    );
}

export default Process;
