import { Fragment } from "react/jsx-runtime"
import "../styles/ConfirmDialog.css"

interface ConfirmDialogProps {
    title?: string
    info: Record<string, string>
    onConfirm: () => void
    onCancel: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    title = "확인",
    info,
    onConfirm,
    onCancel,
}) => (
    <div className="cd-overlay">
        <div className="cd-dialog">
            <div className="cd-header">
                <span>{title}</span>
                <button className="cd-close" onClick={onCancel}>×</button>
            </div>
            <div className="cd-body">
                <p>아래 내용을 확인 후 진행해주세요.</p>
                <dl>
                    {Object.entries(info).map(([label, value]) => (
                        <Fragment key={label}>
                            <dt>{label}</dt>
                            <dd title={value}>{value}</dd>
                        </Fragment>
                    ))}
                </dl>
            </div>
            <div className="cd-footer">
                <button className="cd-btn cd-btn-cancel" onClick={onCancel}>취소</button>
                <button className="cd-btn cd-btn-confirm" onClick={onConfirm}>확인</button>
            </div>
        </div>
    </div>
)