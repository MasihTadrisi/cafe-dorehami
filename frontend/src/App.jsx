import React, { useState, useEffect, useCallback, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import questions from "./questions.json";
import "./App.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API_URL = "https://cafe-backend-rrmi.onrender.com";

const categorizedMenu = {
  "نوشیدنی‌های گرم": [
    { id: 1, name: "سرویس چای دونفره", price: 100000, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFftmc4FYop2a0r77DCRtjHZO7-nJOddA9cQ&s" },
    { id: 2, name: "چای لیوانی", price: 50000, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-IpFAi5Z53e3kVYrDLtS3Uj1Ta3yPUFkqiA&s" },
    { id: 3, name: "چای دارچین و عسل", price: 140000, image: "https://salamatim.com/wp-content/uploads/2021/04/Health-Benefits-Of-Cinnamon-Tea2.jpg" },
    { id: 4, name: "چای ماسالا", price: 130000, image: "https://sarinamasala.com/wp-content/uploads/2025/05/IMG_3828-1.jpg" },
    { id: 5, name: "قهوه لاته", price: 130000, image: "https://kalleh.com/book/wp-content/uploads/sites/2/2025/01/%D9%82%D9%87%D9%88%D9%87-%D9%84%D8%A7%D8%AA%D9%87-%DA%86%DB%8C%D8%B3%D8%AA.jpg" },
    { id: 6, name: "قهوه اسپرسو", price: 60000, image: "https://espresso-market.com/wp-content/uploads/2024/08/unnamed-1.jpg" },
    { id: 7, name: "قهوه ترک", price: 65000, image: "https://cactus-food.ir/Content/images/3596/Product/209688/%D9%82%D9%87%D9%88%D9%87%20%D8%AA%D8%B1%DA%A9.jpg" },
    { id: 8, name: "آفوگاتو", price: 135000, image: "https://blog.okcs.com/wp-content/uploads/2023/06/%D8%A2%D9%811.jpg" },
    { id: 9, name: "هات چاکلت", price: 130000, image: "https://www.cocoterra.com/wp-content/uploads/belgian-hot-chocolate-recipe-drink.jpg" },
    { id: 10, name: "نسکافه گلد", price: 110000, image: "https://behicoffee.com/wp-content/uploads/2023/07/Spray-dried-coffee-with-coffee-mate.jpg" },
    { id: 11, name: "شیرنسکافه", price: 135000, image: "https://cafe-abasabad.ir/wp-content/uploads/2024/02/frame-101-65c1ed7957f4c.webp" },
  ],
  "نوشیدنی‌های سرد": [
    { id: 12, name: "کافه گلاسه", price: 190000, image: "https://zarinbano.com/wp-content/uploads/%D8%B7%D8%B1%D8%B2-%D8%AA%D9%87%DB%8C%D9%87-%DA%A9%D8%A7%D9%81%D9%87-%DA%AF%D9%84%D8%A7%D8%B3%D9%87.jpg" },
    { id: 13, name: "طالبی گلاسه", price: 190000, image: "https://asrturkiye.com/wp-content/uploads/2025/06/15-34.webp" },
    { id: 14, name: "شکلات گلاسه", price: 190000, image: "https://bepazeem.com/wp-content/uploads/2022/12/Chocolate-Galce-1-1-2.jpg" },
    { id: 15, name: "آیس اسپرسو", price: 120000, image: "https://magerta.ir/wp-content/uploads/2023/05/iced-coffee-recipe-cover-1024x683.jpg" },
    { id: 16, name: "بستنی", price: 140000, image: "https://blog.okcs.com/wp-content/uploads/2021/07/mast-bastani-asli-1.jpg" },
    { id: 17, name: "شیرموز", price: 155000, image: "https://img9.irna.ir/d/r2/2023/04/25/0/170327889.png?ts=1682420033614" },
    { id: 18, name: "آب هویج", price: 135000, image: "https://vaziri-ind.ir/wp-content/uploads/2022/02/%D8%AE%D8%A7%D8%B5%DB%8C%D8%AA-%D8%A7%D8%A8-%D9%87%D9%88%DB%8C%D8%AC-%D8%A8%D8%B1%D8%A7%DB%8C-%D9%BE%D9%88%D8%B3%D8%AA.jpg" },
    { id: 19, name: "آب طالبی", price: 135000, image: "https://mag.delta.ir/wp-content/uploads/2024/04/Milkshake-.jpg" },
    { id: 20, name: "آب پرتقال", price: 135000, image: "https://files.namnak.com/users/sr/aup/201807/379_pics/%D8%AE%D9%88%D8%A7%D8%B5-%D8%A2%D8%A8-%D9%BE%D8%B1%D8%AA%D9%82%D8%A7%D9%84.webp" },
    { id: 21, name: "آب هویج بستنی", price: 160000, image: "https://hamavita.com/wp-content/uploads/2023/09/c428d7ea-c6e4-4382-88c9-ad5a02dd95c3-500x500.webp" },
    { id: 22, name: "آّب طالبی بستنی", price: 160000, image: "https://iranipokht.ir/wp-content/uploads/2025/05/how-to-prepare-cantaloupe-juice-ice-cream-logo-1.jpg" },
    { id: 23, name: "موهیتو", price: 155000, image: "https://foodculture.ir/wp-content/uploads/2018/04/mojito-1300x867.jpg" },
  ],
  "کیک ها": [
    { id: 24, name: "کیک شکلاتی", price: 120000, image: "https://rang-rangi.ir/images/1280/cake-khis.jpg" },
    { id: 25, name: "کیک روز", price: 130000, image: "https://zino.cafe/wp-content/uploads/2020/12/%DA%A9%DB%8C%DA%A9-%D8%B1%D9%88%D8%B2.jpg" },
    { id: 26, name: "کیک بستنی", price: 130000, image: "https://files.namnak.com/users/sr/aup/201807/379_pics/%DA%A9%DB%8C%DA%A9-%D8%A8%D8%B3%D8%AA%D9%86%DB%8C.webp" },
    { id: 27, name: "پنکیک نوتلا", price: 145000, image: "https://static.cdn.asset.aparat.cloud/avt/52788440-3410-l__6627.jpg?width=900&quality=90&secret=aZf9hDmNYoT_n8fU1pQDzg" },
  ],
  "انواع شیک": [
    { id: 28, name: "شیک نوتلا", price: 190000, image: "https://saas-behtarino.hs3.ir/media/business_products_images/img-20220909-wa0007.jpg" },
    { id: 29, name: "شیک شکلاتی", price: 170000, image: "https://saas-behtarino.hs3.ir/media/business_products_images/7ddfe124-4a5c-4ed1-9b7f-065f7625723b.jpg" },
    { id: 30, name: "شیک موز شکلات", price: 185000, image: "https://blog.okcs.com/wp-content/uploads/2023/05/Healthy-Banana-Chocolate-Smoothie-720x720-1.jpg" },
    { id: 31, name: "شیک شکلات نسکافه", price: 185000, image: "https://ashpazsho.ir/wp-content/uploads/2021/04/milkshake-chocolate.webp" },
    { id: 32, name: "شیک انبه", price: 200000, image: "https://darnahayat.ir/wp-content/uploads/2022/07/milkshake-anbe.jpg" },
    { id: 33, name: "شیک کیت کت", price: 190000, image: "https://shoominerest.com/wp-content/uploads/2024/02/%D8%B4%DB%8C%DA%A9-%DA%A9%DB%8C%D8%AA%DA%A9%D8%AA-scaled.jpg" },
    { id: 34, name: "شیک توت فرنگی", price: 200000, image: "https://cdn.asriran.com/files/fa/news/1404/2/20/2164058_600.jpg" },
    { id: 35, name: "شیک بادام زمینی", price: 180000, image: "https://blog.okcs.com/wp-content/uploads/2023/06/Peanut-butter-milkshake-recipe.jpg" },
    { id: 36, name: "شیک قهوه", price: 175000, image: "https://hshtpa.ir/wp-content/uploads/2022/08/%D8%B4%DB%8C%DA%A9-%D9%82%D9%87%D9%88%D9%87-%D8%AE%D8%A7%D9%86%DA%AF%DB%8C.jpg" },
  ],
  "دمنوش ها": [
    { id: 37, name: "گل گاو زبان", price: 120000, image: "https://ajiledalat.com/blog/wp-content/uploads/2023/12/Brewing-borage.jpg" },
    { id: 38, name: "چای ترش", price: 120000, image: "https://www.ghafaridiet.com/upload/article/1671258853.jpg" },
    { id: 39, name: "چای سبز", price: 120000, image: "https://drjafargholi.com/wp-content/uploads/2021/01/green-tea-properties.jpg" },
    { id: 40, name: "دمنوش آرامش", price: 120000, image: "https://iranvegstore.com/wp-content/uploads/2022/10/%D8%A8%D9%87%D8%AA%D8%B1%DB%8C%D9%86-%D8%AF%D9%85%D9%86%D9%88%D8%B4-%D8%B2%D9%85%D8%B3%D8%AA%D8%A7%D9%86.jpg" },
    { id: 41, name: "دمنوش سلامت", price: 120000, image: "https://mugestan.com/mag/wp-content/uploads/2022/11/%D8%AF%D9%85%D9%86%D9%88%D8%B4-%D9%85%D9%81%DB%8C%D8%AF13.jpg" },
  ],
  "غذا ها": [
    { id: 42, name: "پاستا دورهمی", price: 290000, image: "https://panamag.ir/wp-content/uploads/2023/05/pasta-sabzijat.jpg" },
    { id: 43, name: "سالاد دورهمی", price: 280000, image: "https://noyanrestaurant.ir/media/k2/items/cache/c82cc4e14a1d2c8c8ffff9840d24b558_XL.jpg?t=20241006_170018" },
    { id: 44, name: "سالاد رژیمی", price: 360000, image: "https://cdn.nutgy.com/wp-content/uploads/2024/07/111-ezgif.com-png-to-webp-converter.webp" },
    { id: 45, name: "سیب زمینی با سس قارچ", price: 220000, image: "https://hashtiha.com/wp-content/uploads/2025/05/%D8%B7%D8%B1%D8%B2-%D8%AA%D9%87%DB%8C%D9%87-%D8%B3%DB%8C%D8%A8-%D8%B2%D9%85%DB%8C%D9%86%DB%8C-%D8%A8%D8%A7-%D8%B3%D8%B3-%D9%82%D8%A7%D8%B1%DA%86.jpg" },
    { id: 46, name: "سیب زمینی سرخ شده", price: 150000, image: "https://chishi.ir/wp-content/uploads/2020/05/sibzamini-sorkh-karde.jpg" },
    { id: 47, name: "فیله سوخاری سه تیکه", price: 380000, image: "https://static.delino.com/Image/Restaurant/Food/z3v0hfla.dgh_560x350.jpg" },
    { id: 48, name: "اسپاگتی با مرغ گریل", price: 330000, image: "https://cdn.rokna.net/thumbnail/3R3qtQSwINl2/4AWGqs3C3zj1VoMP2nMyyYaJhBmE6YiWGA6feRzhrZzE_cqDIHOPkq-1-4nX83BW/%D9%BE%D8%A7%D8%B3%D8%AA%D8%A7+%D8%A2%D9%84%D9%81%D8%B1%D8%AF%D9%88.jpg" },
    { id: 49, name: "املت", price: 140000, image: "https://panamag.ir/wp-content/uploads/2021/09/omlet-robi.jpg" },
    { id: 50, name: "چیپس و پنیر", price: 220000, image: "https://noktechi.ir/wp-content/uploads/2022/04/hot-chips.jpg" },
    { id: 51, name: "اسنک", price: 180000, image: "https://server01.farsibeauty.com/public/articles/cover/2022/7/md/809c2f28-3621-452d-84fa-aede0008bc2a-%D8%A7%D8%B3%D9%86%DA%A9-%D9%85%D8%B1%D8%BA.jpg" },
    { id: 52, name: "همبرگر مخصوص", price: 420000, image: "https://www.alamto.com/wp-content/uploads/2022/07/d5vv-hero-scaled.webp" },
    { id: 53, name: "قارچ سوخاری", price: 250000, image: "https://jadvalyab.ir/blog/wp-content/uploads/2022/10/unnamed.jpg" },
  ],
  "قلیون": [
    { id: 54, name: "قلیون با سرویس ساده", price: 120000, image: "https://s3.dana.ir/dana/uploads/01/06/1399/1639418.jpg" },
    { id: 55, name: "قلیون با سرویس ویژه", price: 200000, image: "https://www.health4mom.org/wp-content/uploads/2024/09/dreamstime_xxl_176376572-scaled-2-1024x684.jpg" },
  ],
};

const hookahFlavors = ["دو سیب", "لیمو", "پرتقال نعنا", "لیمو نعنا", "نعنایی", "مخصوص دورهمی"];

function App() {
  const [selectedCategory, setSelectedCategory] = useState("نوشیدنی‌های گرم");
  const [selectedItems, setSelectedItems] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [page, setPage] = useState("order");
  const [orders, setOrders] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState({ id: "1", total: 0, daily: Array(7).fill(0) });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showFlavorSelector, setShowFlavorSelector] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const orderSectionRef = useRef(null);
  const [discounts, setDiscounts] = useState([]);
  const [countdown, setCountdown] = useState({});
  const [newDiscount, setNewDiscount] = useState(null);

  // Game State
  const [gameState, setGameState] = useState({
    currentQuestionIndex: 0,
    score: 0,
    questions: [],
    selectedAnswer: null,
    timeLeft: 15,
  });

  // مدیریت محو شدن ارور
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        setTimeout(() => setError(null), 500);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // به‌روزرسانی تایمرهای معکوس
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        const updated = {};
        discounts.forEach(discount => {
          const remaining = getRemainingTimeInSeconds(discount.timestamp);
          if (remaining > 0) {
            updated[discount.id] = remaining;
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [discounts]);

  // حذف تخفیف‌های منقضی‌شده
  useEffect(() => {
    const now = Date.now();
    const twelveHours = 12 * 60 * 60 * 1000;
    const validDiscounts = discounts.filter(d => now - d.timestamp < twelveHours);
    if (validDiscounts.length !== discounts.length) {
      setDiscounts(validDiscounts);
      localStorage.setItem("discounts", JSON.stringify(validDiscounts));
    }
  }, [discounts]);

  // Fetch Initial Data
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/orders`);
      const validOrders = (res.data || []).filter(
        o => o.id && o.tableNumber && !isNaN(new Date(o.timestamp).getTime())
      );
      setOrders(validOrders);
    } catch (err) {
      console.error("Fetch orders error:", err.response || err.message);
      setError("خطا در دریافت سفارش‌ها: " + err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/weeklyRevenue/1`);
      const data = res.data && res.data.id ? res.data : { id: "1", total: 0, daily: Array(7).fill(0) };
      setWeeklyRevenue(data);
    } catch (err) {
      console.error("Fetch revenue error:", err.response || err.message);
      setError("خطا در دریافت درآمد: " + err.message);
      setWeeklyRevenue({ id: "1", total: 0, daily: Array(7).fill(0) });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiscounts = useCallback(() => {
    const storedDiscounts = JSON.parse(localStorage.getItem("discounts") || "[]");
    const now = Date.now();
    const twelveHours = 12 * 60 * 60 * 1000;
    const validDiscounts = storedDiscounts.filter(d => now - d.timestamp < twelveHours);
    setDiscounts(validDiscounts);
    localStorage.setItem("discounts", JSON.stringify(validDiscounts));
    const initialCountdown = {};
    validDiscounts.forEach(discount => {
      initialCountdown[discount.id] = getRemainingTimeInSeconds(discount.timestamp);
    });
    setCountdown(initialCountdown);
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchRevenue();
    fetchDiscounts();
  }, [fetchOrders, fetchRevenue, fetchDiscounts]);

  // Timer for Game
  useEffect(() => {
    if (page === "game" && gameState.timeLeft > 0) {
      const timer = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            handleNextQuestion();
            return { ...prev, timeLeft: 15 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [page, gameState.timeLeft]);

  // Reset Timer on Question Change
  useEffect(() => {
    if (page === "game") {
      setGameState(prev => ({ ...prev, timeLeft: 15 }));
    }
  }, [gameState.currentQuestionIndex, page]);

  // Validate Phone Number
  const validatePhoneNumber = useCallback(phone => /^09\d{9}$/.test(phone), []);

  // Register User
  const handleRegister = useCallback(async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError("لطفاً شماره موبایل معتبر (11 رقمی با شروع 09) وارد کنید.");
      return;
    }
    if (phoneNumber === "09901295140") {
      setError("این شماره مختص مدیر کافه است و نمی‌تواند ثبت‌نام کند.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/users?phoneNumber=${phoneNumber}`);
      if (res.data.length > 0) {
        setError("این شماره موبایل قبلاً ثبت شده است.");
        return;
      }
      const newUser = { phoneNumber, name: userName || "", id: Date.now().toString() };
      await axios.post(`${API_URL}/api/users`, newUser);
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      setPage("dashboard");
      setPhoneNumber("");
      setUserName("");
      setError("ثبت‌نام با موفقیت انجام شد.");
    } catch (err) {
      console.error("Register error:", err.response || err.message);
      setError("خطا در ثبت‌نام: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, userName, validatePhoneNumber]);

  // Login User
  const handleLogin = useCallback(async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError("لطفاً شماره موبایل معتبر (11 رقمی با شروع 09) وارد کنید.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/users?phoneNumber=${phoneNumber}`);
      if (phoneNumber === "09901295140") {
        setShowAdminLogin(true);
        return;
      }
      if (res.data.length === 0) {
        setError("این شماره موبایل ثبت‌نام نشده است. لطفاً ثبت‌نام کنید.");
        return;
      }
      setCurrentUser(res.data[0]);
      setIsLoggedIn(true);
      setPage("dashboard");
      setPhoneNumber("");
      setError("ورود با موفقیت انجام شد.");
    } catch (err) {
      console.error("Login error:", err.response || err.message);
      setError("خطا در ورود: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, validatePhoneNumber]);

  // Admin Login
  const handleAdminLogin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (adminPassword === "1234") {
        setCurrentUser({ phoneNumber: "09901295140", name: "مدیر", id: "admin" });
        setIsLoggedIn(true);
        setPage("admin");
        setAdminPassword("");
        setShowAdminLogin(false);
        setError("ورود مدیر با موفقیت انجام شد.");
      } else {
        setError("رمز عبور اشتباه است.");
      }
    } catch (err) {
      console.error("Admin login error:", err.response || err.message);
      setError("خطا در ورود مدیر: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [adminPassword]);

  // Game Functions
  const showGameRules = () => setPage("gameRules");

  const startGame = () => {
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
    setGameState({
      currentQuestionIndex: 0,
      score: 0,
      questions: shuffledQuestions,
      selectedAnswer: null,
      timeLeft: 15,
    });
    setNewDiscount(null);
    setPage("game");
  };

  const handleAnswerSelect = answer => {
    setGameState(prev => ({ ...prev, selectedAnswer: answer }));
  };

  const handleNextQuestion = useCallback(() => {
    const { selectedAnswer, questions, currentQuestionIndex, score } = gameState;
    let newScore = score;
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      newScore += 1;
    }
    if (currentQuestionIndex < 9) {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedAnswer: null,
        score: newScore,
        timeLeft: 15,
      }));
    } else {
      setGameState(prev => ({ ...prev, score: newScore }));
      const finalScore = newScore;
      if (finalScore >= 8 && currentUser) {
        const now = Date.now();
        const twelveHours = 12 * 60 * 60 * 1000;
        const storedDiscounts = JSON.parse(localStorage.getItem("discounts") || "[]");
        const lastDiscount = storedDiscounts
          .filter(d => d.userPhone === currentUser.phoneNumber)
          .sort((a, b) => b.timestamp - a.timestamp)[0];
        if (!lastDiscount || now - lastDiscount.timestamp > twelveHours) {
          let discountAmount = 0;
          if (finalScore === 8) discountAmount = 10000;
          else if (finalScore === 9) discountAmount = 20000;
          else if (finalScore === 10) discountAmount = 30000;
          if (discountAmount > 0) {
            const discountCode = `DISCOUNT-${Date.now()}`;
            const newDiscount = {
              code: discountCode,
              amount: discountAmount,
              timestamp: now,
              userPhone: currentUser.phoneNumber,
              id: Date.now().toString(),
            };
            const updatedDiscounts = [
              ...storedDiscounts.filter(d => now - d.timestamp < twelveHours),
              newDiscount,
            ];
            localStorage.setItem("discounts", JSON.stringify(updatedDiscounts));
            setDiscounts(updatedDiscounts);
            setCountdown(prev => ({
              ...prev,
              [newDiscount.id]: twelveHours / 1000,
            }));
            setNewDiscount(newDiscount);
          }
        }
      }
      setPage("gameResult");
    }
  }, [gameState, currentUser]);

  const getRemainingTimeInSeconds = timestamp => {
    const now = Date.now();
    const twelveHours = 12 * 60 * 60 * 1000;
    const remaining = twelveHours - (now - timestamp);
    return remaining > 0 ? Math.floor(remaining / 1000) : 0;
  };

  const formatCountdown = seconds => {
    if (seconds <= 0) return "منقضی شده";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getFormattedDate = timestamp => {
    const date = new Date(timestamp);
    const days = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];
    return `${days[date.getDay()]}، ${date.toLocaleDateString("fa-IR")}`;
  };

  const copyDiscountCode = code => {
    navigator.clipboard.writeText(code).then(() => {
      setError("کد تخفیف کپی شد!");
    }).catch(err => {
      console.error("Error copying code:", err);
      setError("خطا در کپی کردن کد!");
    });
  };

  // Order Functions
  const handleItemClick = useCallback(
    item => {
      if (item.name.includes("قلیون")) {
        setPendingItem(item);
        setSelectedFlavor("");
        setShowFlavorSelector(true);
      } else {
        addToOrder(item);
      }
    },
    []
  );

  const addToOrder = useCallback(
    item => {
      setSelectedItems(prevItems => {
        const existing = prevItems.find(
          i => i.id === item.id && (item.flavor ? i.flavor === item.flavor : !i.flavor)
        );
        if (existing) {
          return prevItems.map(i =>
            i.id === item.id && (item.flavor ? i.flavor === item.flavor : !i.flavor)
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prevItems, { ...item, quantity: 1 }];
      });
    },
    []
  );

  const changeQuantity = useCallback(
    (id, flavor, increment) => {
      setSelectedItems(prevItems =>
        prevItems
          .map(item =>
            item.id === id && (flavor ? item.flavor === flavor : !item.flavor)
              ? { ...item, quantity: item.quantity + increment }
              : item
          )
          .filter(item => item.quantity > 0)
      );
    },
    []
  );

  const removeFromOrder = useCallback(
    (id, flavor) => {
      setSelectedItems(prevItems =>
        prevItems.filter(item => !(item.id === id && (flavor ? item.flavor === flavor : !item.flavor)))
      );
    },
    []
  );

  const submitOrder = useCallback(async () => {
    if (!tableNumber) {
      setError("لطفاً شماره میز را وارد کنید.");
      return;
    }
    if (selectedItems.length === 0) {
      setError("لطفاً آیتمی انتخاب کنید.");
      return;
    }
    const newOrder = {
      id: Date.now().toString(),
      tableNumber,
      items: selectedItems,
      timestamp: Date.now(),
      status: "pending",
      total: selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/orders`, newOrder);
      setOrders(prev => [...prev, res.data]);
      setSelectedItems([]);
      setTableNumber("");
      setError("سفارش با موفقیت ثبت شد!");
    } catch (err) {
      console.error("Submit order error:", err.response || err.message);
      setError("خطا در ثبت سفارش: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedItems, tableNumber]);

  const confirmFlavorSelection = useCallback(() => {
    if (!selectedFlavor) {
      setError("لطفاً یک طعم انتخاب کنید.");
      return;
    }
    addToOrder({ ...pendingItem, flavor: selectedFlavor });
    setShowFlavorSelector(false);
    setSelectedFlavor("");
    setPendingItem(null);
  }, [selectedFlavor, pendingItem, addToOrder]);

  const markOrderAsCompleted = useCallback(
    async orderId => {
      setLoading(true);
      setError(null);
      try {
        const order = orders.find(o => o.id === orderId);
        if (!order || !order.tableNumber || isNaN(new Date(order.timestamp).getTime())) {
          setOrders(prev => prev.filter(o => o.id !== orderId));
          setError("سفارش نامعتبر حذف شد.");
          return;
        }
        const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const orderDate = new Date(order.timestamp);
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        if (orderDate >= weekStart && orderDate <= today) {
          const dayIndex = orderDate.getDay();
          const newDaily = [...(weeklyRevenue.daily || Array(7).fill(0))];
          newDaily[dayIndex] = (newDaily[dayIndex] || 0) + orderTotal;
          const newTotal = (weeklyRevenue.total || 0) + orderTotal;
          await axios.patch(`${API_URL}/api/weeklyRevenue/1`, {
            total: newTotal,
            daily: newDaily,
          });
          setWeeklyRevenue({ id: "1", total: newTotal, daily: newDaily });
        }
        await axios.delete(`${API_URL}/api/orders/${orderId}`);
        setOrders(prev => prev.filter(o => o.id !== orderId));
        setError("سفارش با موفقیت تأیید و حذف شد.");
      } catch (err) {
        console.error("Delete order error:", err.response || err.message);
        setError(`خطا در تأیید/حذف سفارش: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [orders, weeklyRevenue]
  );

  const resetWeeklyRevenue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`${API_URL}/api/weeklyRevenue/1`, {
        total: 0,
        daily: Array(7).fill(0),
      });
      setWeeklyRevenue({ id: "1", total: 0, daily: Array(7).fill(0) });
      setError("درآمد هفتگی با موفقیت ریست شد.");
    } catch (err) {
      console.error("Reset revenue error:", err.response || err.message);
      setError("خطا در ریست درآمد: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const scrollToOrder = () => {
    orderSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const chartData = {
    labels: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"],
    datasets: [
      {
        label: "درآمد روزانه (تومان)",
        data: weeklyRevenue.daily || Array(7).fill(0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "درآمد (تومان)" } },
      x: { title: { display: true, text: "روزهای هفته" } },
    },
    plugins: { legend: { display: true, position: "top" } },
  };

  return (
    <div className="App">
      {loading && <p className="loading-text">در حال بارگذاری...</p>}
      {error && (
        <p className={`error-text ${showError ? "fade-in" : "fade-out"}`}>
          {error}
        </p>
      )}

      <nav className="pages-button">
        <button onClick={() => setPage("order")} disabled={loading}>
          سفارش
        </button>
        <button
          onClick={() => setPage(isLoggedIn ? "dashboard" : "login")}
          disabled={loading}
        >
          بازی و تخفیف
        </button>
      </nav>

      {showFlavorSelector && (
        <div className="flavor-selector-modal">
          <div>
            <h3>لطفاً طعم قلیون را انتخاب کنید</h3>
            <ul>
              {hookahFlavors.map(flavor => (
                <li key={flavor}>
                  <label>
                    <input
                      type="radio"
                      name="flavor"
                      value={flavor}
                      checked={selectedFlavor === flavor}
                      onChange={() => setSelectedFlavor(flavor)}
                      disabled={loading}
                    />
                    {flavor}
                  </label>
                </li>
              ))}
            </ul>
            <button onClick={confirmFlavorSelection} disabled={loading}>
              تایید
            </button>
            <button onClick={() => setShowFlavorSelector(false)} disabled={loading}>
              لغو
            </button>
          </div>
        </div>
      )}

      {page === "order" && (
        <>
          <h1 className="cafe-title">کافه دورهمی</h1>
          <div className="category-buttons">
            {Object.keys(categorizedMenu).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "active" : ""}
                disabled={loading}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="menu">
            {categorizedMenu[selectedCategory].map(item => {
              const selectedItem = selectedItems.find(
                i => i.id === item.id && (item.flavor ? i.flavor === item.flavor : !i.flavor)
              );
              return (
                <div key={item.id} className="menu-item">
                  <img
                    src={item.image || "/images/default.jpg"}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                  <h3>{item.name}</h3>
                  <p>{item.price.toLocaleString()} تومان</p>
                  {!selectedItem && (
                    <button onClick={() => handleItemClick(item)} disabled={loading}>
                      سفارش
                    </button>
                  )}
                  {selectedItem && (
                    <div className="quantity-control">
                      <button
                        onClick={() => changeQuantity(item.id, item.flavor, -1)}
                        disabled={loading}
                      >
                        -
                      </button>
                      <span style={{ margin: "0 10px" }}>{selectedItem.quantity}</span>
                      <button
                        onClick={() => changeQuantity(item.id, item.flavor, 1)}
                        disabled={loading}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="order" ref={orderSectionRef}>
            <h2>سفارش شما</h2>
            {selectedItems.length > 0 ? (
              <>
                <ul>
                  {selectedItems.map((item, index) => (
                    <li key={index} className="order-item">
                      <span>
                        {item.name} {item.flavor ? `- طعم: ${item.flavor}` : ""} (تعداد: {item.quantity}) - {(item.price * item.quantity).toLocaleString()} تومان
                      </span>
                      <button
                        className="remove-button"
                        onClick={() => removeFromOrder(item.id, item.flavor)}
                        disabled={loading}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="total-price">
                  جمع کل: {selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()} تومان
                </p>
                <input
                  type="number"
                  placeholder="شماره میز..."
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  className="input-field"
                  disabled={loading}
                />
                <button onClick={submitOrder} disabled={loading}>
                  ثبت سفارش‌ها
                </button>
              </>
            ) : (
              <p>هیچ آیتمی انتخاب نشده است.</p>
            )}
          </div>
          <button className="go-to-order" onClick={scrollToOrder} disabled={loading}>
            <span>ثبت نهایی سفارش</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="arrow-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
            </svg>
          </button>
        </>
      )}

      {page === "login" && (
        <div className="login-panel">
          <h2>ورود / ثبت‌نام</h2>
          <p className="discount-teaser">🎉 با برنده شدن در بازی، تا ۳۰,۰۰۰ تومان تخفیف بگیرید!</p>
          <input
            type="text"
            placeholder="شماره موبایل (11 رقم)"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            className="input-field"
            disabled={loading}
          />
          {showAdminLogin && phoneNumber === "09901295140" ? (
            <>
              <input
                type="password"
                placeholder="رمز عبور مدیر"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="input-field"
                disabled={loading}
              />
              <button onClick={handleAdminLogin} disabled={loading}>
                ورود مدیر
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="نام (اختیاری)"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="input-field"
                disabled={loading}
              />
              <button onClick={handleRegister} disabled={loading}>
                ثبت‌نام
              </button>
              <button onClick={handleLogin} disabled={loading}>
                ورود
              </button>
            </>
          )}
        </div>
      )}

      {page === "dashboard" && isLoggedIn && (
        <div className="dashboard">
          <h2>{currentUser.name ? `خوش آمدی، ${currentUser.name}!` : "خوش آمدی!"}</h2>
          <p className="discount-info">هر روز فقط از یک کد تخفیف می‌توانید استفاده کنید.</p>
          <button onClick={showGameRules} disabled={loading}>
            شروع بازی اطلاعات عمومی
          </button>
          <h3>کدهای تخفیف شما</h3>
          {discounts.length > 0 ? (
            <div className="discount-cards">
              {discounts
                .filter(d => d.userPhone === currentUser.phoneNumber)
                .map((discount, index) => (
                  <div
                    key={index}
                    className={`discount-card ${countdown[discount.id] <= 0 ? "expired" : ""}`}
                  >
                    <p className="discount-congrats">🎉 تبریک! شما یک کد تخفیف دریافت کردید!</p>
                    <p className="discount-code">
                      کد: {discount.code}
                      <button
                        className="copy-button"
                        onClick={() => copyDiscountCode(discount.code)}
                        disabled={countdown[discount.id] <= 0 || loading}
                      >
                        کپی
                      </button>
                    </p>
                    <p className="discount-amount">مبلغ تخفیف: {discount.amount.toLocaleString()} تومان</p>
                    <p className={`discount-timer ${countdown[discount.id] <= 300 ? "warning" : ""}`}>
                      زمان باقی‌مانده: {formatCountdown(countdown[discount.id] || 0)}
                    </p>
                    <p className="discount-date">📅 تاریخ ثبت: {getFormattedDate(discount.timestamp)}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p>هیچ کد تخفیفی موجود نیست.</p>
          )}
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setCurrentUser(null);
              setPage("login");
            }}
            disabled={loading}
          >
            خروج
          </button>
        </div>
      )}

      {page === "gameRules" && isLoggedIn && (
        <div className="game-rules">
          <h2>شرایط بازی اطلاعات عمومی</h2>
          <ul>
            <li>بازی شامل 10 سوال اطلاعات عمومی است.</li>
            <li>هر سوال 15 ثانیه زمان دارد.</li>
            <li>اگر در 15 ثانیه جواب ندهید، به سوال بعدی می‌روید و امتیازی ثبت نمی‌شود.</li>
            <li>برای دریافت تخفیف، باید حداقل به 8 سوال درست جواب دهید.</li>
            <li>امتیاز 8: 10,000 تومان تخفیف</li>
            <li>امتیاز 9: 20,000 تومان تخفیف</li>
            <li>امتیاز 10: 30,000 تومان تخفیف</li>
            <li>هر کاربر در هر 12 ساعت فقط می‌تواند یک کد تخفیف دریافت کند.</li>
            <li>کدهای تخفیف تا 12 ساعت معتبر هستند.</li>
          </ul>
          <button onClick={startGame} disabled={loading}>
            شروع بازی
          </button>
          <button onClick={() => setPage("dashboard")} disabled={loading}>
            بازگشت به داشبورد
          </button>
        </div>
      )}

      {page === "game" && isLoggedIn && (
        <div className="game">
          <h2>سوال {gameState.currentQuestionIndex + 1} از 10</h2>
          <p>زمان باقی‌مانده: {gameState.timeLeft} ثانیه</p>
          <div className="timer-container">
            <div className="timer-bar">
              <div
                className={`timer-progress ${gameState.timeLeft <= 5 ? "warning" : ""}`}
                style={{
                  width: `${(gameState.timeLeft / 15) * 100}%`,
                }}
              />
            </div>
          </div>
          <p>{gameState.questions[gameState.currentQuestionIndex].question}</p>
          <ul>
            {gameState.questions[gameState.currentQuestionIndex].options.map(
              (option, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={gameState.selectedAnswer === option}
                      onChange={() => handleAnswerSelect(option)}
                      disabled={loading}
                    />
                    {option}
                  </label>
                </li>
              )
            )}
          </ul>
          <button
            onClick={handleNextQuestion}
            disabled={!gameState.selectedAnswer || loading}
          >
            سوال بعدی
          </button>
        </div>
      )}

      {page === "gameResult" && isLoggedIn && (
        <div className="game-result">
          <h2>نتیجه بازی</h2>
          <p>امتیاز شما: {gameState.score} از 10</p>
          {gameState.score >= 8 && (newDiscount || discounts.find(d => d.userPhone === currentUser.phoneNumber && getRemainingTimeInSeconds(d.timestamp) > 0)) && (
            <p className="discount">
              تبریک! شما {gameState.score === 8 ? 10000 : gameState.score === 9 ? 20000 : 30000} تومان تخفیف گرفتید!
              {newDiscount && (
                <>
                  <br />
                  کد تخفیف: {newDiscount.code}
                  <button
                    className="copy-button"
                    onClick={() => copyDiscountCode(newDiscount.code)}
                    disabled={loading}
                  >
                    کپی
                  </button>
                </>
              )}
            </p>
          )}
          <button onClick={startGame} disabled={loading}>
            بازی دوباره
          </button>
          <button
            onClick={() => {
              setNewDiscount(null);
              setPage("dashboard");
            }}
            disabled={loading}
          >
            بازگشت به داشبورد
          </button>
        </div>
      )}

      {page === "admin" && isLoggedIn && currentUser.phoneNumber === "09901295140" && (
        <div className="admin-panel">
          <h2>پنل مدیریت — سفارش‌های در انتظار</h2>
          {!orders || orders.length === 0 ? (
            <p>هیچ سفارش در انتظاری ثبت نشده است.</p>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-admin-item">
                  <h3>میز {order.tableNumber || "نامشخص"}</h3>
                  <p>
                    زمان ثبت: {isNaN(new Date(order.timestamp).getTime()) ? "نامعتبر" : new Date(order.timestamp).toLocaleString("fa-IR")}
                  </p>
                  <ul>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} {item.flavor ? `- طعم: ${item.flavor}` : ""} (تعداد: {item.quantity || 1}) - {((item.price || 0) * (item.quantity || 1)).toLocaleString()} تومان
                        </li>
                      ))
                    ) : (
                      <li>بدون آیتم</li>
                    )}
                  </ul>
                  <p>
                    جمع کل: {order.items && order.items.length > 0 ? order.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toLocaleString() : "0"} تومان
                  </p>
                  <button
                    onClick={() => markOrderAsCompleted(order.id)}
                    disabled={loading}
                  >
                    تأیید و حذف
                  </button>
                </div>
              ))}
            </div>
          )}
          <h2>درآمد هفتگی</h2>
          <p>
            جمع کل درآمد: {(weeklyRevenue.total ?? 0).toLocaleString()} تومان
          </p>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <button onClick={resetWeeklyRevenue} disabled={loading}>
            ریست درآمد هفتگی
          </button>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setCurrentUser(null);
              setPage("login");
            }}
            disabled={loading}
          >
            خروج از حساب
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
