import { Button } from "@/components/ui/Button";

export default function Roles() {
    const rolesCount = 5;
    const roles = [
        {
            url: null,
            title: 'Daddy',
            owners: 420,
            color: 'red'
        },
        {
            url: 'https://raw.githubusercontent.com/ChillerDragon/discord-irc/master/src/img/emotes/ddnet_lgbt.png',
            title: 'Admin',
            owners: 69,
            color: 'purple'
        }
    ];

    return (
        <div>
            <h2 className="text-high-emphasis text-3xl">Roles</h2>
            <p className="text-medium-emphasis">Do i even need this title above? LMAO</p>
            <div className="flex mt-5">
                <input placeholder="Search roles" className="transition-all duration-300 max-w-[400px] w-full border-[1px] bg-[rgba(0,0,0,.45)] border-[rgba(0,0,0,0)] rounded-[10px] py-1.5 px-[12px] text-[white] outline-0 focus:border-primary-1" />
                <Button styleType="filled" className="ml-3">Create role</Button>
            </div>
            <div className="flex mt-7">
                <span className="text-medium-emphasis block max-w-[300px] font-bold text-[12px] uppercase w-full">ROLES-{rolesCount}</span>
                <span className="text-medium-emphasis text-[12px] font-bold uppercase">Members</span>
            </div>
            <div className="mt-2">
                {roles.map(role => {
                    return (
                        <div className="flex py-2 hover:bg-primary-3 cursor-pointer rounded-md">
                            <div className="max-w-[300px] w-full flex items-center pl-2">
                                <span className="w-[20px] h-[20px] block rounded-full" style={{ backgroundColor: role.color }}></span>
                                {role.url &&
                                    <img className="w-[30px] h-[30px] ml-1" src={role.url} />
                                }
                                <span className="text-high-emphasis ml-2">{role.title}</span>
                            </div>
                            <span className="text-medium-emphasis">{role.owners}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
