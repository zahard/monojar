import { formatCurrency } from "../hooks/format-num";
import type { JarTransaction } from "../types/transaction";

export function TablePreview({ data }: { data: JarTransaction[] }) {
  return (
    <div className="max-h-100 overflow-y-scroll">
      <div>
        <table className="resTable">
          <thead>
            <tr>
              <th>№</th>
              <th>Amount</th>
              <th>From</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatCurrency(item.amount, true)}</td>
                <td>
                  {item.description} {item.comment ? " - " : ""} {item.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
