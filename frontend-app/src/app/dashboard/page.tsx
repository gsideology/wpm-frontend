"use client";
import { useBackendDashboard } from "../../hooks/use-backend-dashboard";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { logout, user } = useAuth();
  const {
    data,
    isLoading,
    error,
    refresh,
    isRefreshing,
    syncWooCommerce,
    isSyncing,
  } = useBackendDashboard();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const openBtn = document.getElementById("open-sidebar");

      if (
        sidebar &&
        openBtn &&
        !sidebar.contains(event.target as Node) &&
        !openBtn.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="relative bg-[#070b18] h-full min-h-screen">
        <div className="flex items-start">
          {/* Sidebar */}
          <nav
            id="sidebar"
            className={`lg:w-[270px] max-lg:fixed transition-all duration-500 shrink-0 z-[100] ${
              sidebarOpen ? "max-lg:w-[270px]" : "max-lg:w-0"
            }`}
          >
            <div
              id="sidebar-collapse-menu"
              className={`bg-[#081028] shadow-lg h-screen fixed top-0 left-0 overflow-auto overflow-x-hidden z-[99] lg:w-[270px] max-lg:w-[270px] max-lg:${
                sidebarOpen ? "visible" : "invisible"
              } transition-all duration-500`}
            >
              <div className="bg-[#081028] flex items-center gap-4 pt-6 pb-2 px-4 sticky top-0 min-h-[64px] z-[100]">
                <div className="flex items-center gap-2 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 140 140"
                    className="w-8 h-8"
                  >
                    <path
                      fill="#017bfe"
                      d="M70.5 84.5c-.2373-1.291.096-2.291 1-3 21.8405.3271 32.341-10.3395 31.5-32-2.5-10.5-9-17-19.5-19.5-24.6667-.3333-49.3333-.6667-74-1-.77972-1.073-.61305-2.2396.5-3.5C16.1349 18.364 22.6349 11.5307 29.5 5l6-3c19-.66667 38-.66667 57 0 32.848 7.87547 47.348 28.7088 43.5 62.5-1.027 4.1079-2.36 8.1079-4 12-5.389 7.4915-11.222 14.4915-17.5 21 7.198 12.561 14.532 25.061 22 37.5-.145.772-.478 1.439-1 2-9.333.667-18.667.667-28 0l-6-3c-10.5578-16.384-20.8911-32.884-31-49.5Z"
                    />
                    <path
                      fill="#ffffff"
                      d="M71.5 81.5c-.904.709-1.2373 1.709-1 3-6.5003-1.3148-13.0003-1.3148-19.5 0-2.9442 16.274-5.6109 32.608-8 49-.5 1.167-1.3333 2-2.5 2.5-8.5921 2.14-17.0921 1.973-25.5-.5 1.6773-17.058 3.6773-34.058 6-51-6.0758-.9764-12.24243-1.3097-18.5-1-.15668-1.3734.00999-2.7068.5-4 10.3693-10.7008 20.3693-21.7008 30-33 2.754-3.2621 5.9206-5.9288 9.5-8 1.5293.0288 2.696.6955 3.5 2 8.3287 13.8168 16.8287 27.4835 25.5 41Z"
                    />
                  </svg>
                  <p className="text-base font-semibold text-gray-300 tracking-wide">
                    Dashboard
                  </p>
                </div>

                <button
                  id="close-sidebar"
                  className="ml-auto cursor-pointer lg:hidden"
                  onClick={toggleSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 fill-gray-300"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M.13 17.05a1.41 1.41 0 0 1 1.41-1.41H10a1.41 1.41 0 1 1 0 2.82H1.54a1.41 1.41 0 0 1-1.41-1.41zm0-14.1a1.41 1.41 0 0 1 1.41-1.41h16.92a1.41 1.41 0 1 1 0 2.82H1.54A1.41 1.41 0 0 1 .13 2.95zm0 7.05a1.41 1.41 0 0 1 1.41-1.41h16.92a1.41 1.41 0 1 1 0 2.82H1.54A1.41 1.41 0 0 1 .13 10z"
                      clipRule="evenodd"
                      data-original="#000000"
                    />
                  </svg>
                </button>
              </div>

              <div className="py-4 px-4">
                <div className="flex relative bg-[#0b1739] px-3 py-2.5 rounded-md border border-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 mr-1 inline fill-gray-400"
                    viewBox="0 0 118.783 118.783"
                  >
                    <path
                      d="M115.97 101.597 88.661 74.286a47.75 47.75 0 0 0 7.333-25.488c0-26.509-21.49-47.996-47.998-47.996S0 22.289 0 48.798c0 26.51 21.487 47.995 47.996 47.995a47.776 47.776 0 0 0 27.414-8.605l26.984 26.986a9.574 9.574 0 0 0 6.788 2.806 9.58 9.58 0 0 0 6.791-2.806 9.602 9.602 0 0 0-.003-13.577zM47.996 81.243c-17.917 0-32.443-14.525-32.443-32.443s14.526-32.444 32.443-32.444c17.918 0 32.443 14.526 32.443 32.444S65.914 81.243 47.996 81.243z"
                      data-original="#000000"
                    />
                  </svg>
                  <input
                    className="text-sm text-gray-300 outline-0 bg-transparent px-1 max-w-[130px]"
                    placeholder="Search..."
                  />
                </div>

                <ul className="space-y-2 mt-6">
                  <li>
                    <div className="text-gray-300 text-sm font-medium flex items-center cursor-pointer hover:bg-[#0b1739] rounded-md px-3 py-2.5 transition-all duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="w-[18px] h-[18px] mr-3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19.56 23.253H4.44a4.051 4.051 0 0 1-4.05-4.05v-9.115c0-1.317.648-2.56 1.728-3.315l7.56-5.292a4.062 4.062 0 0 1 4.644 0l7.56 5.292a4.056 4.056 0 0 1 1.728 3.315v9.115a4.051 4.051 0 0 1-4.05 4.05zM12 2.366a2.45 2.45 0 0 0-1.393.443l-7.56 5.292a2.433 2.433 0 0 0-1.037 1.987v9.115c0 1.34 1.09 2.43 2.43 2.43h15.12c1.34 0 2.43-1.09 2.43-2.43v-9.115c0-.788-.389-1.533-1.037-1.987l-7.56-5.292A2.438 2.438 0 0 0 12 2.377z"
                          data-original="#000000"
                        />
                        <path
                          d="M16.32 23.253H7.68a.816.816 0 0 1-.81-.81v-5.4c0-2.83 2.3-5.13 5.13-5.13s5.13 2.3 5.13 5.13v5.4c0 .443-.367.81-.81.81zm-7.83-1.62h7.02v-4.59c0-1.933-1.577-3.51-3.51-3.51s-3.51 1.577-3.51 3.51z"
                          data-original="#000000"
                        />
                      </svg>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        Dashboard
                      </span>
                    </div>
                  </li>

                  <li>
                    <div className="text-gray-300 text-sm font-medium flex items-center cursor-pointer hover:bg-[#0b1739] rounded-md px-3 py-2.5 transition-all duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="w-[18px] h-[18px] mr-3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M18 2c2.206 0 4 1.794 4 4v12c0 2.206-1.794 4-4 4H6c-2.206 0-4-1.794-4-4V6c0-2.206 1.794-4 4-4zm0-2H6a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6z"
                          data-original="#000000"
                        />
                        <path
                          d="M12 18a1 1 0 0 1-1-1V7a1 1 0 0 1 2 0v10a1 1 0 0 1-1 1z"
                          data-original="#000000"
                        />
                        <path
                          d="M6 12a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1z"
                          data-original="#000000"
                        />
                      </svg>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        Prodotti
                      </span>
                    </div>
                  </li>

                  <li>
                    <div className="text-gray-300 text-sm font-medium flex items-center cursor-pointer hover:bg-[#0b1739] rounded-md px-3 py-2.5 transition-all duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="w-[18px] h-[18px] mr-3"
                        viewBox="0 0 512 512"
                      >
                        <path
                          d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
                          data-original="#000000"
                        />
                      </svg>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        Utenti
                      </span>
                    </div>
                  </li>

                  <li>
                    <div className="text-gray-300 text-sm font-medium flex items-center cursor-pointer hover:bg-[#0b1739] rounded-md px-3 py-2.5 transition-all duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="w-[18px] h-[18px] mr-3"
                        viewBox="0 0 25 25"
                      >
                        <g data-name="Action Expand">
                          <path
                            d="M21.5 1.25h-18A2.25 2.25 0 0 0 1.25 3.5v18a2.25 2.25 0 0 0 2.25 2.25h18a2.25 2.25 0 0 0 2.25-2.25v-18a2.25 2.25 0 0 0-2.25-2.25zm.75 20.25a.75.75 0 0 1-.75.75h-18a.75.75 0 0 1-.75-.75v-18a.75.75 0 0 1 .75-.75h18a.75.75 0 0 1 .75.75z"
                            data-original="#000000"
                          />
                          <path
                            d="M11.75 7.25h1.5v10.5h-1.5z"
                            data-original="#000000"
                          />
                          <path
                            d="M7.25 11.75h10.5v1.5H7.25z"
                            data-original="#000000"
                          />
                        </g>
                      </svg>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        Azioni
                      </span>
                    </div>
                  </li>
                </ul>

                <hr className="border-gray-600 my-6" />

                <div>
                  <ul className="space-y-2">
                    <li>
                      <div className="text-gray-300 text-sm font-medium flex items-center cursor-pointer hover:bg-[#0b1739] rounded-md px-3 py-2.5 transition-all duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="w-[18px] h-[18px] mr-3"
                          viewBox="0 0 214.27 214.27"
                        >
                          <path
                            d="M196.926 55.171c-.11-5.785-.215-11.25-.215-16.537a7.5 7.5 0 0 0-7.5-7.5c-32.075 0-56.496-9.218-76.852-29.01a7.498 7.498 0 0 0-10.457 0c-20.354 19.792-44.771 29.01-76.844 29.01a7.5 7.5 0 0 0-7.5 7.5c0 5.288-.104 10.755-.215 16.541-1.028 53.836-2.436 127.567 87.331 158.682a7.495 7.495 0 0 0 4.912 0c89.774-31.116 88.368-104.849 87.34-158.686zm-89.795 143.641c-76.987-27.967-75.823-89.232-74.79-143.351.062-3.248.122-6.396.164-9.482 30.04-1.268 54.062-10.371 74.626-28.285 20.566 17.914 44.592 27.018 74.634 28.285.042 3.085.102 6.231.164 9.477 1.032 54.121 2.195 115.388-74.798 143.356z"
                            data-original="#000000"
                          />
                          <path
                            d="m132.958 81.082-36.199 36.197-15.447-15.447a7.501 7.501 0 0 0-10.606 10.607l20.75 20.75a7.477 7.477 0 0 0 5.303 2.196 7.477 7.477 0 0 0 5.303-2.196l41.501-41.5a7.498 7.498 0 0 0 .001-10.606 7.5 7.5 0 0 0-10.606-.001z"
                            data-original="#000000"
                          />
                        </svg>
                        <span>Sicurezza</span>
                      </div>
                    </li>
                    <li>
                      <div className="text-gray-300 text-sm font-medium flex items-center cursor-pointer hover:bg-[#0b1739] rounded-md px-3 py-2.5 transition-all duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="w-[18px] h-[18px] mr-3"
                          viewBox="0 0 64 64"
                        >
                          <path
                            d="M61.4 29.9h-6.542a9.377 9.377 0 0 0-18.28 0H2.6a2.1 2.1 0 0 0 0 4.2h33.978a9.377 9.377 0 0 0 18.28 0H61.4a2.1 2.1 0 0 0 0-4.2Zm-15.687 7.287A5.187 5.187 0 1 1 50.9 32a5.187 5.187 0 0 1-5.187 5.187ZM2.6 13.1h5.691a9.377 9.377 0 0 0 18.28 0H61.4a2.1 2.1 0 0 0 0-4.2H26.571a9.377 9.377 0 0 0-18.28 0H2.6a2.1 2.1 0 0 0 0 4.2Zm14.837-7.287A5.187 5.187 0 0 1 22.613 11a5.187 5.187 0 0 1-10.364 0 5.187 5.187 0 0 1 5.187-5.187ZM61.4 50.9H35.895a9.377 9.377 0 0 0-18.28 0H2.6a2.1 2.1 0 0 0 0 4.2h15.015a9.377 9.377 0 0 0 18.28 0H61.4a2.1 2.1 0 0 0 0-4.2Zm-34.65 7.287A5.187 5.187 0 1 1 31.937 53a5.187 5.187 0 0 1-5.187 5.187Z"
                            data-name="Layer 47"
                            data-original="#000000"
                          />
                        </svg>
                        <span>Preferenze</span>
                      </div>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left text-gray-300 text-sm font-medium flex items-center cursor-pointer hover:bg-[#0b1739] rounded-md px-3 py-2.5 transition-all duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="w-[18px] h-[18px] mr-3"
                          viewBox="0 0 24 24"
                        >
                          <path d="M16 13v-2H7V8l-5 4 5 4v-3z M17.057 19.057C16.071 20.043 14.714 20.5 13 20.5s-3.071-.457-4.057-1.443C8.957 18.071 8.5 16.714 8.5 15s.457-3.071 1.443-4.057C10.929 9.957 12.286 9.5 14 9.5s3.071.457 4.057 1.443C19.043 11.929 19.5 13.286 19.5 15s-.457 3.071-1.443 4.057z" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>

                  <div className="mt-6 flex items-center cursor-pointer">
                    <img
                      src="https://readymadeui.com/profile.webp"
                      className="w-9 h-9 rounded-full border-2 border-gray-600 shrink-0"
                    />
                    <div className="ml-4">
                      <p className="text-sm text-gray-300 whitespace-nowrap">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-400 whitespace-nowrap">
                        {user?.email || "admin@example.com"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile sidebar toggle button */}
          <button
            id="open-sidebar"
            className="lg:hidden fixed top-[30px] left-[18px] cursor-pointer z-[101]"
            onClick={toggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 fill-gray-300"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M.13 17.05a1.41 1.41 0 0 1 1.41-1.41H10a1.41 1.41 0 1 1 0 2.82H1.54a1.41 1.41 0 0 1-1.41-1.41zm0-14.1a1.41 1.41 0 0 1 1.41-1.41h16.92a1.41 1.41 0 1 1 0 2.82H1.54A1.41 1.41 0 0 1 .13 2.95zm0 7.05a1.41 1.41 0 0 1 1.41-1.41h16.92a1.41 1.41 0 1 1 0 2.82H1.54A1.41 1.41 0 0 1 .13 10z"
                clipRule="evenodd"
                data-original="#000000"
              />
            </svg>
          </button>

          {/* Main content */}
          <section className="main-content w-full p-6 max-lg:ml-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-white">
                  Caricamento dashboard...
                </span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-screen">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
                  <h2 className="text-red-800 font-semibold">
                    Errore nel caricamento dei dati
                  </h2>
                  <p className="text-red-600 mt-1">{error.message}</p>
                  <button
                    onClick={() => refresh()}
                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Riprova
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center flex-wrap gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Benvenuto nella Dashboard
                      </h3>
                      <p className="text-xs text-gray-300">
                        Gestione completa dei dati e sincronizzazione
                        WooCommerce
                      </p>
                    </div>

                    <div className="ml-auto">
                      <div className="flex gap-4">
                        <button
                          onClick={() => refresh()}
                          disabled={isRefreshing}
                          className="flex items-center px-4 py-2.5 text-sm text-white bg-[#0b1739] border-0 outline-0 rounded-sm cursor-pointer hover:bg-[#0d1f4a] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isRefreshing ? "Aggiornamento..." : "Aggiorna Dati"}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1 fill-white w-3.5 h-3.5"
                            viewBox="0 0 6.35 6.35"
                          >
                            <path
                              d="M3.173.058a.284.284 0 0 0-.28.29L2.892 4.59a.284.284 0 1 0 .566 0L3.46.347a.284.284 0 0 0-.287-.289zM1.758 4.303a.284.284 0 0 0-.196.487l1.415 1.414a.284.284 0 0 0 .401 0L4.793 4.79a.284.284 0 0 0-.401-.401L3.178 5.605 1.96 4.39a.284.284 0 0 0-.203-.086z"
                              data-original="#000000"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => syncWooCommerce()}
                          disabled={isSyncing}
                          className="flex items-center px-4 py-2.5 text-sm text-white bg-[#017bfe] border-0 outline-0 rounded-sm cursor-pointer hover:bg-[#0166cc] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSyncing
                            ? "Sincronizzazione..."
                            : "Sincronizza WooCommerce"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="mt-12 mb-6 px-2">
                  <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-6">
                    {/* Total Products Card */}
                    <div className="bg-[#0b1739] [box-shadow:0_4px_12px_-5px_rgba(0,0,0,0.4)] p-6 w-full rounded-lg overflow-hidden">
                      <div className="inline-block bg-[#edf2f7] rounded-lg py-2 px-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-white">
                          Prodotti Totali
                        </h3>
                        <p className="mt-2 text-sm text-gray-300">
                          Numero totale di prodotti nel sistema
                        </p>
                      </div>

                      <div className="mt-6">
                        <div className="flex mb-2">
                          <p className="text-sm text-gray-300 flex-1">
                            {data?.totalProducts || 0}
                          </p>
                          <p className="text-sm text-gray-300">prodotti</p>
                        </div>
                        <div className="bg-gray-300 rounded-full w-full h-2.5">
                          <div className="w-full h-full rounded-full bg-[#017bfe] flex items-center"></div>
                        </div>
                      </div>
                    </div>

                    {/* Forecasted Sales Card */}
                    <div className="bg-[#0b1739] [box-shadow:0_4px_12px_-5px_rgba(0,0,0,0.4)] p-6 w-full rounded-lg overflow-hidden">
                      <div className="inline-block bg-[#edf2f7] rounded-lg py-2 px-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        </svg>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-white">
                          Vendite Previste
                        </h3>
                        <p className="mt-2 text-sm text-gray-300">
                          Valore totale delle vendite previste
                        </p>
                      </div>

                      <div className="mt-6">
                        <div className="flex mb-2">
                          <p className="text-sm text-gray-300 flex-1">
                            €{data?.totalForecastedSales || 0}
                          </p>
                          <p className="text-sm text-gray-300">euro</p>
                        </div>
                        <div className="bg-gray-300 rounded-full w-full h-2.5">
                          <div className="w-full h-full rounded-full bg-green-500 flex items-center"></div>
                        </div>
                      </div>
                    </div>

                    {/* Organization Info Card */}
                    <div className="bg-[#0b1739] [box-shadow:0_4px_12px_-5px_rgba(0,0,0,0.4)] p-6 w-full rounded-lg overflow-hidden">
                      <div className="inline-block bg-[#edf2f7] rounded-lg py-2 px-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-white">
                          Organizzazione
                        </h3>
                        <p className="mt-2 text-sm text-gray-300">
                          Informazioni sull&apos;organizzazione
                        </p>
                      </div>

                      <div className="mt-6">
                        <div className="text-sm text-gray-300">
                          <p>
                            <strong>ID:</strong> {data?.organizationId || "N/A"}
                          </p>
                          <p>
                            <strong>Stato:</strong>{" "}
                            <span className="text-green-400">✓ Connesso</span>
                          </p>
                          <p>
                            <strong>Ultimo aggiornamento:</strong>
                          </p>
                          <p className="text-xs">
                            {new Date().toLocaleString("it-IT")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-8 bg-[#0b1739] p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Informazioni API
                  </h2>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>
                      <strong>Organizzazione ID:</strong>{" "}
                      {data?.organizationId || "N/A"}
                    </p>
                    <p>
                      <strong>Ultimo aggiornamento:</strong>{" "}
                      {new Date().toLocaleString("it-IT")}
                    </p>
                    <p>
                      <strong>Stato connessione:</strong>{" "}
                      <span className="text-green-400">
                        ✓ Connesso al backend
                      </span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
