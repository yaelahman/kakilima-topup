import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { getAccountInfo } from "@/services/order.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";

interface BuyerInfoFormProps {
    userInfo: any;
    productSlug: string;
    onChange: (userInfo: any) => void;
    forms: any[];
    enableCheckerId: boolean;
}

export const BuyerInfoForm = ({ userInfo, onChange, forms, productSlug, enableCheckerId }: BuyerInfoFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [accountInfo, setAccountInfo] = useState<any>(null);

    // Save user info to session storage
    // useEffect(() => {
    //     if (userInfo && Object.keys(userInfo).length > 0) {
    //         const sessionKey = `userInfo_${productSlug}`;
    //         sessionStorage.setItem(sessionKey, JSON.stringify(userInfo));
    //     }
    // }, [userInfo, productSlug]);

    // // Load user info from session storage on component mount
    // useEffect(() => {
    //     const sessionKey = `userInfo_${productSlug}`;
    //     const savedUserInfo = sessionStorage.getItem(sessionKey);
    //     if (savedUserInfo) {
    //         try {
    //             const parsedUserInfo = JSON.parse(savedUserInfo);
    //             onChange(parsedUserInfo);
    //         } catch (error) {
    //             console.error('Error parsing saved user info:', error);
    //         }
    //     }
    // }, [productSlug, onChange]);

    const handleChange = (e: any, name: string) => {
        const value = e.target.value;
        onChange({ ...userInfo, [name]: value });
    }

    const allFieldsFilled = useMemo(() => {
        return Object.keys(userInfo).every((key) => {
            return userInfo[key] && userInfo[key].toString().trim() !== '';
        });
    }, [userInfo]);

    const handleCheckAccount = async () => {
        if (!enableCheckerId) return;

        if (allFieldsFilled) {
            try {
                setIsLoading(true);
                const response = await getAccountInfo({
                    slug: productSlug,
                    userData: userInfo
                });
                const data = response.data;
                if (data.status) {
                    setAccountInfo(data);
                } else {
                    setAccountInfo(null);
                }
            } catch (error) {
                setAccountInfo(null);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    }

    if (!forms?.length) {
        return null;
    }

    return (
        <div className="mb-4 hidden md:block">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-950 px-4 py-4 text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
                        <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-sky-300">Langkah 02</p>
                        <span className="font-display text-lg font-semibold">Informasi Pembeli</span>
                    </div>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                    <div className="space-y-3">
                        {forms.map((form, index) => (
                            <div key={index} className="relative">
                                <input
                                    type="text"
                                    id={form.name}
                                    placeholder=" "
                                    value={userInfo[form.name] || ''}
                                    onChange={(e) => handleChange(e, form.name)}
                                    onBlur={() => handleCheckAccount()}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary transform transition-all duration-500 ease-in-out hover:border-primary/50 peer"
                                />
                                <label
                                    htmlFor={form.name}
                                    className="absolute left-4 top-4 text-gray-500 transition-all duration-300 -translate-y-7 bg-white px-2 scale-75 transform origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent peer-focus:scale-75 peer-focus:-translate-y-7 peer-focus:bg-white peer-focus:text-primary peer-placeholder-shown:top-2 peer-focus:top-4"
                                >
                                    {form.description}
                                </label>
                            </div>
                        ))}
                        {enableCheckerId && allFieldsFilled && (
                            <div className="bg-gray-50/80 border border-gray-100 p-3 rounded-xl">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Status Akun:</span>
                                    {isLoading ? (
                                        <span className="text-sm text-gray-500">
                                            Memuat...
                                        </span>
                                    ) : accountInfo && accountInfo?.status ? (
                                        <span className="text-sm font-medium text-green-600">
                                            {accountInfo?.data || 'Ditemukan'} &nbsp;
                                            <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 me-1" />
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-red-600">
                                            Tidak ditemukan &nbsp;
                                            <FontAwesomeIcon icon={faTimesCircle} className="h-3 w-3 me-1" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 