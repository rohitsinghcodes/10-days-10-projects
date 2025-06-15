import { useEffect, useState, useCallback } from "react";
import currencyapi from "@everapi/currencyapi-js";
import {
    Github,
    Linkedin,
    Globe,
    Twitter,
    Facebook,
    Instagram,
    RefreshCw, // Added for a more explicit loading indicator
} from "lucide-react";

const client = new currencyapi(import.meta.env.VITE_CURRENCY_API_KEY);

const CurrencyConverter = () => {
    const [symbols, setSymbols] = useState({});
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("INR");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch currency symbols once
    useEffect(() => {
        const fetchSymbols = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await client.currencies();
                if (data && data.data) {
                    setSymbols(data.data);
                } else {
                    setError("Failed to load currency symbols. Please try again later.");
                }
            } catch (err) {
                console.error("Failed to fetch symbols:", err);
                setError("Network error or API issue. Could not load currency symbols.");
            } finally {
                setLoading(false);
            }
        };

        fetchSymbols();
    }, []);

    // Memoized conversion function to prevent unnecessary re-renders
    const convertCurrency = useCallback(async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            setResult(null);
            setError("Please enter a valid positive amount.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await client.latest({
                base_currency: from,
                currencies: [to],
            });
            const rate = res.data[to]?.value;
            if (rate) {
                setResult((amount * rate).toFixed(3));
            } else {
                setError(`Conversion from ${from} to ${to} is currently unavailable.`);
            }
        } catch (err) {
            console.error("Conversion error:", err);
            setError("Failed to convert currency. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [amount, from, to]);

    // Convert currency automatically when amount/from/to changes with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            convertCurrency();
        }, 500); // Increased debounce to 500ms for potentially more complex API calls

        return () => clearTimeout(timer);
    }, [amount, from, to, convertCurrency]); // Added convertCurrency to dependency array

    const swapCurrencies = () => {
        setFrom(to);
        setTo(from);
        setResult(null); // Clear result after swap, new conversion will trigger
        setError(null); // Clear any previous errors
    };

    return (
        <>
            <div className="max-w-md w-11/12 mx-auto bg-gray-50 shadow-lg p-6 rounded-lg space-y-4 my-8 md:my-auto">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 flex items-center justify-center gap-2">
                    <span role="img" aria-label="currency exchange">
                        💱
                    </span>{" "}
                    Currency Converter
                </h2>

                <div className="relative">
                    <input
                        type="number"
                        className="w-full p-3 border border-gray-300 rounded-lg text-center text-xl focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0" // Prevent negative amounts
                        aria-label="Amount to convert"
                    />
                    {loading && (
                        <div className="absolute inset-y-0 right-3 flex items-center pr-3">
                            <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <select
                        className="w-full sm:w-5/12 p-3 border border-gray-300 rounded-lg text-lg bg-white appearance-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out cursor-pointer"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        aria-label="Convert from currency"
                        disabled={loading || Object.keys(symbols).length === 0}
                    >
                        {Object.keys(symbols).length > 0 ? (
                            Object.keys(symbols).map((code) => (
                                <option key={code} value={code}>
                                    {code} - {symbols[code].name}
                                </option>
                            ))
                        ) : (
                            <option value="">Loading currencies...</option>
                        )}
                    </select>

                    <button
                        onClick={swapCurrencies}
                        className="px-5 py-2 text-2xl bg-gray-200 hover:bg-gray-300 rounded-full transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
                        title="Swap Currencies"
                        aria-label="Swap currencies"
                        disabled={loading}
                    >
                        🔄
                    </button>

                    <select
                        className="w-full sm:w-5/12 p-3 border border-gray-300 rounded-lg text-lg bg-white appearance-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out cursor-pointer"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        aria-label="Convert to currency"
                        disabled={loading || Object.keys(symbols).length === 0}
                    >
                        {Object.keys(symbols).length > 0 ? (
                            Object.keys(symbols).map((code) => (
                                <option key={code} value={code}>
                                    {code} - {symbols[code].name}
                                </option>
                            ))
                        ) : (
                            <option value="">Loading currencies...</option>
                        )}
                    </select>
                </div>

                {error && (
                    <p className="text-center text-red-600 text-sm font-medium animate-pulse">
                        {error}
                    </p>
                )}

                {result && !error && (
                    <p className="text-center text-xl font-semibold text-gray-700 mt-4">
                        {amount} {from} ={" "}
                        <span className="text-blue-700 font-bold">{result}</span> {to}
                    </p>
                )}
            </div>


            {/* Footer */}
            <footer className="fixed bottom-4 right-4 bg-gray-800 text-white text-sm rounded-lg px-4 py-3 shadow-lg z-50">
                <div className="flex flex-col items-end gap-2 text-right">
                    <p className="text-xs">
                        Made by{" "}
                        <a
                            href="https://rohitsinghcodes-portfolio.onrender.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="italic text-blue-400 hover:text-blue-300"
                        >
                            Rohit Singh
                        </a>
                    </p>

                    <div className="flex gap-3 items-center">
                        <a
                            href="https://github.com/rohitsinghcodes"
                            target="_blank"
                            aria-label="GitHub"
                            title="GitHub"
                            className="hover:text-gray-300"
                        >
                            <Github size={20} />
                        </a>
                        <a
                            href="https://linkedin.com/in/rohitsinghcodes"
                            target="_blank"
                            aria-label="LinkedIn"
                            title="LinkedIn"
                            className="hover:text-blue-400"
                        >
                            <Linkedin size={20} />
                        </a>
                        <a
                            href="https://twitter.com/rohitsinghcodes"
                            target="_blank"
                            aria-label="Twitter"
                            title="Twitter / X"
                            className="hover:text-white"
                        >
                            <Twitter size={20} />
                        </a>
                        <a
                            href="https://facebook.com/rohitsinghcodes"
                            target="_blank"
                            aria-label="Facebook"
                            title="Facebook"
                            className="hover:text-blue-500"
                        >
                            <Facebook size={20} />
                        </a>
                        <a
                            href="https://instagram.com/rohitsinghcodes"
                            target="_blank"
                            aria-label="Instagram"
                            title="Instagram"
                            className="hover:text-pink-400"
                        >
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default CurrencyConverter;