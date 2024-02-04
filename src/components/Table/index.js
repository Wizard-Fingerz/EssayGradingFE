import React, { useState, useEffect } from "react";
import styles from "./Table.module.css";
import ActionButton from "/components/sample_components/ui-components/ActionButton";
import PaginationButton from "/components/sample_components/ui-components/PaginationButton";
import Section from '../../sample_components/ui-components/Section';

import { FaSearch } from 'react-icons/fa';

const ProspectTable = ({
    headingRightItem1 = () => { },
    headingRightItem2 = () => { },
    heading,
    data,
}) => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;
    const [activeButton, setActiveButton] = useState("All");

    // Extract unique categories from data
    // Extract unique categories from data only when data is not empty
    const uniqueCategories = data.length > 0
        ? [...new Set(data.map((item) => item.property_type || "Others"))]
        : [];


    console.log('Unique Categories:', uniqueCategories);
    // Update state with available categories
    const [availableCategories, setAvailableCategories] = useState(["All", ...uniqueCategories]);

    useEffect(() => {
        setAvailableCategories(["All", ...uniqueCategories]);
    }, [data]); // Trigger the effect whenever data changes

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleButtonClick = (category) => {
        setActiveButton(category);
    };

    const filteredData =
        selectedCategory === "All"
            ? data.filter((item) =>
                Object.values(item).some(
                    (value) =>
                        typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
            : data.filter((item) =>
                item.property_type && item.property_type === selectedCategory &&
                Object.values(item).some(
                    (value) =>
                        typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );


    // Calculate total pages and update filteredData based on current page and itemsPerPage
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const rangeStart = (currentPage - 1) * itemsPerPage + 1;
    const rangeEnd = Math.min(currentPage * itemsPerPage, filteredData.length);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFirstPage = () => {
        handlePageChange(1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    const handleLastPage = () => {
        handlePageChange(totalPages);
    };

    return (
        <div style={{ marginTop: '50px' }}>
            <section className={styles["table-container"]}>
                <div className={styles["table-header"]}>
                    <div>
                        <div>
                            <Section>
                                {availableCategories.map((category) => (
                                    <ActionButton
                                        key={category}
                                        label={category}
                                        isActive={activeButton === category}
                                        inverse={true}
                                        onClick={() => {
                                            handleCategoryChange(category);
                                            handleButtonClick(category);
                                        }}
                                        style={{ margin: '5px' }}
                                    />
                                ))}

                            </Section>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            style={{
                                borderRadius: '15px',
                                height: '40px',
                                fontSize: '16px',
                                padding: '20px',
                                border: '0.5px solid grey',
                                borderColor: 'grey',
                                paddingLeft: '40px', // Add left padding to accommodate the search icon
                            }}
                        />
                        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                            <FaSearch />
                        </div>
                    </div>
                    {headingRightItem1()}
                    {headingRightItem2()}
                </div>
                <div className={styles["table-wrapper"]} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className={styles["table"]}>
                        <thead className={styles["fixed-header-wrapper"]}>
                            {/* <thead> */}
                            <tr className={styles["table-fixed-header"]}>
                                {/* <tr> */}
                                {heading.map((th, i) => (
                                    <th key={i}>
                                        {th.icon ? (
                                            <span>
                                                {th.heading}
                                                <th.icon />
                                            </span>
                                        ) : (
                                            th.heading
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {currentItems.map((tr) => (
                            <tr key={tr.id}>
                                {heading.map((th, i) => (
                                    <td key={i}>
                                        {tr[th.key] &&
                                            typeof tr[th.key] === "object" &&
                                            tr[th.key].component
                                            ? tr[th.key].component()
                                            : tr[th.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </table>
                </div>
                {/* Pagination buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
                    <Section>
                        <PaginationButton
                            label="First"
                            inverse={true}
                            onClick={handleFirstPage}
                            disabled={currentPage === 1}
                            isActive={currentPage === 1}
                            style={{ margin: '0 5px' }}
                        />
                        <PaginationButton
                            label="Previous"
                            inverse={true}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            isActive={false}
                            style={{ margin: '0 5px' }}
                        />
                        <PaginationButton
                            label="Next"
                            inverse={true}
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            isActive={false}
                            style={{ margin: '0 5px' }}
                        />
                        <PaginationButton
                            label="Last"
                            inverse={true}
                            onClick={handleLastPage}
                            disabled={currentPage === totalPages}
                            isActive={currentPage === totalPages}
                            style={{ margin: '0 5px' }}
                        />
                    </Section>
                </div>
                {/* Range of instances per page */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
                    <p>
                        Showing {rangeStart} - {rangeEnd} of {filteredData.length} instances
                    </p>
                </div>
            </section>
        </div>
    );
};

export default ProspectTable;
