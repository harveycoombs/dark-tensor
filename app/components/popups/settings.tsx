import Popup from "@/app/components/common/popup";

interface Properties {
    user: any;
    onClose: any;
}

export default function SettingsPopup({ user, onClose }: Properties) {
    return (
        <Popup title="Settings" onClose={onClose}>
            <div className="w-650 flex pb-3">
                <div className="w-44 mt-2">
                    <div>
                        <div className="inline-grid align-middle place-items-center bg-blue-100 text-blue-600 text-sm leading-none select-none font-medium w-9 h-9 rounded-full">{(user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0)).toUpperCase()}</div>
                        <div className="inline-block align-middle ml-2">
                            <strong className="text-sm font-bold">{user.first_name} {user.last_name}</strong>
                            <div className="text-xs font-medium text-slate-400/80">Joined {new Date(user.creation_date).toLocaleString(undefined, { year: "numeric", month: "short" })}</div>
                        </div>
                        <div className="mt-2">
                            <SettingsMenuItem title="General" />
                            <SettingsMenuItem title="Security" />
                            <SettingsMenuItem title="Advanced" />
                            <div className="p-2 rounded-md leading-none text-sm text-red-500 font-medium mt-1 cursor-pointer duration-100 hover:bg-red-50 active:bg-red-100/80">Log Out</div>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </Popup>
    );
}

function SettingsMenuItem({ title }: any) {
    return <div className="p-2 rounded-md leading-none text-sm text-slate-400/60 font-medium mt-1 cursor-pointer duration-100 hover:bg-slate-50 active:bg-slate-100/80">{title}</div>;
}