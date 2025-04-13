document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const mainScreen = document.getElementById('main-screen');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const currentRole = document.getElementById('current-role');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const navItems = document.querySelectorAll('nav li');
    const contentSections = document.querySelectorAll('.content-section');
    const addItemBtn = document.getElementById('add-item-btn');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const addMemberBtn = document.getElementById('add-member-btn');
    const exportListBtn = document.getElementById('export-list-btn');
    const saveItemBtn = document.getElementById('save-item-btn');
    const saveCategoryBtn = document.getElementById('save-category-btn');
    const inviteMemberBtn = document.getElementById('invite-member-btn');
    const generateExportBtn = document.getElementById('generate-export-btn');
    const categoryTabs = document.querySelectorAll('.tab');
    const checklistItemsContainer = document.getElementById('checklist-items');
    const notificationToast = document.getElementById('notification-toast');
    
    // Modal Elements
    const modals = document.querySelectorAll('.modal');
    const addItemModal = document.getElementById('add-item-modal');
    const addCategoryModal = document.getElementById('add-category-modal');
    const addMemberModal = document.getElementById('add-member-modal');
    const exportModal = document.getElementById('export-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const editItemModal = document.getElementById('edit-item-modal');
    const saveEditBtn = document.getElementById('save-edit-btn');
    
    // Load data from localStorage or use sample data
    let sampleItems = JSON.parse(localStorage.getItem('packpal_items')) || [
        { id: 1, name: 'Tent', category: 'camping', assignedTo: 'sarah', status: 'packed', notes: '4-person tent' },
        { id: 2, name: 'Sleeping Bag', category: 'camping', assignedTo: 'mike', status: 'unpacked', notes: '' },
        { id: 3, name: 'First Aid Kit', category: 'essentials', assignedTo: 'me', status: 'packed', notes: 'Check expiration dates' },
        { id: 4, name: 'Toothbrush', category: 'hygiene', assignedTo: 'me', status: 'delivered', notes: '' },
        { id: 5, name: 'Phone Charger', category: 'tech', assignedTo: 'sarah', status: 'unpacked', notes: 'Bring extra' },
        { id: 6, name: 'Sunscreen', category: 'beach', assignedTo: 'mike', status: 'unpacked', notes: 'SPF 50' },
        { id: 7, name: 'Beach Towels', category: 'beach', assignedTo: 'me', status: 'packed', notes: '2 large towels' },
        { id: 8, name: 'Water Bottles', category: 'essentials', assignedTo: 'sarah', status: 'delivered', notes: '4 reusable bottles' }
    ];
    
    let categories = JSON.parse(localStorage.getItem('packpal_categories')) || [
        { id: 'all', name: 'All Items', icon: 'list' },
        { id: 'clothing', name: 'Clothing', icon: 'tshirt' },
        { id: 'hygiene', name: 'Hygiene', icon: 'tooth' },
        { id: 'tech', name: 'Tech Gear', icon: 'laptop' },
        { id: 'food', name: 'Food & Snacks', icon: 'utensils' },
        { id: 'camping', name: 'Camping', icon: 'campground' },
        { id: 'beach', name: 'Beach Gear', icon: 'umbrella-beach' },
        { id: 'essentials', name: 'Essentials', icon: 'first-aid' }
    ];
    
    const members = [
        { id: 'me', name: 'You', role: 'owner', email: 'owner@example.com' },
        { id: 'sarah', name: 'Sarah', role: 'admin', email: 'sarah@example.com' },
        { id: 'mike', name: 'Mike', role: 'member', email: 'mike@example.com' },
        { id: 'emma', name: 'Emma', role: 'viewer', email: 'emma@example.com' }
    ];
    
    // App State
    let currentUser = JSON.parse(localStorage.getItem('packpal_currentUser')) || null;
    let currentCategory = localStorage.getItem('packpal_currentCategory') || 'all';
    let currentView = localStorage.getItem('packpal_currentView') || 'dashboard';
    
    // Initialize the app
    function initApp() {
        // Event Listeners
        loginBtn.addEventListener('click', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);
        menuToggle.addEventListener('click', toggleSidebar);
        
        // Navigation
        navItems.forEach(item => {
            item.addEventListener('click', () => switchView(item.dataset.section));
        });
        
        // Modals
        addItemBtn.addEventListener('click', () => showModal(addItemModal));
        addCategoryBtn.addEventListener('click', () => showModal(addCategoryModal));
        addMemberBtn.addEventListener('click', () => showModal(addMemberModal));
        exportListBtn.addEventListener('click', () => showModal(exportModal));
        
        saveItemBtn.addEventListener('click', saveNewItem);
        saveCategoryBtn.addEventListener('click', saveNewCategory);
        inviteMemberBtn.addEventListener('click', inviteNewMember);
        generateExportBtn.addEventListener('click', generateExport);
        
        closeModalButtons.forEach(button => {
            button.addEventListener('click', closeAllModals);
        });
        
        // Category tabs
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentCategory = tab.dataset.category;
                renderChecklistItems();
            });
        });
        
        // Add icon selection functionality
        const iconOptions = document.querySelectorAll('.icon-option');
        iconOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all icons
                iconOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked icon
                option.classList.add('active');
            });
        });
        
        // Add edit button handler
        saveEditBtn.addEventListener('click', saveEditItem);
        
        // Setup demo login info
        setupDemoLogin();
    }

    document.body.style.overflow ='hidden';    
    // Login Handler
    function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const role = roleSelect.value;
        
        if (!username || !password) {
            showNotification('Please enter both username and password');
            return;
        }
        
        // Simple validation for demo purposes
        if (password !== ${role}123) {
            showNotification('Invalid credentials. Please try again.');
            return;
        }
        
        currentUser = {
            username,
            role,
            id: role // For demo purposes
        };
        
        // Save user state to localStorage
        localStorage.setItem('packpal_currentUser', JSON.stringify(currentUser));
        
        // Update UI based on role
        updateUIForRole(role);
        currentRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        
        // Switch screens and render data
        loginScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        mainScreen.classList.add('active');
        
        // Show welcome message
        showNotification(Welcome, ${username}! (${role}));
        
        // Render initial data
        renderDashboardStats();
        renderChecklistItems();
    }
    
    // Logout Handler
    function handleLogout() {
        // Reset UI
        mainScreen.style.display = 'none';
        loginScreen.style.display = 'flex';
        mainScreen.classList.remove('active');
        loginScreen.classList.add('active');
        
        // Clear inputs
        usernameInput.value = '';
        passwordInput.value = '';
        roleSelect.value = 'owner';
    }
    
    // Update UI based on user role
    function updateUIForRole(role) {
        currentRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        
        // Hide/show elements based on role
        const ownerAdminElements = document.querySelectorAll('[data-role="owner"], [data-role="admin"]');
        const memberElements = document.querySelectorAll('[data-role="member"]');
        const viewerElements = document.querySelectorAll('[data-role="viewer"]');
        
        ownerAdminElements.forEach(el => {
            el.style.display = (role === 'owner' || role === 'admin') ? '' : 'none';
        });
        
        memberElements.forEach(el => {
            el.style.display = role === 'member' ? '' : 'none';
        });
        
        viewerElements.forEach(el => {
            el.style.display = role === 'viewer' ? '' : 'none';
        });
        
        // Disable elements for viewer
        if (role === 'viewer') {
            const editableElements = document.querySelectorAll('input, select, textarea, button');
            editableElements.forEach(el => {
                if (!el.classList.contains('close-modal') && el.id !== 'logout-btn') {
                    el.disabled = true;
                }
            });
        }
    }
    
    // Toggle Sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
    }
    
    // Switch between views
    function switchView(view) {
        currentView = view;
        
        // Update active nav item
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === view) {
                item.classList.add('active');
            }
        });
        
        // Show the corresponding section
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === ${view}-section) {
                section.classList.add('active');
            }
        });
        
        // Update content if needed
        if (view === 'dashboard') {
            renderDashboardStats();
        } else if (view === 'checklists') {
            renderChecklistItems();
        }
    }
    
    // Show modal
    function showModal(modal) {
        closeAllModals();
        modal.classList.add('active');
    }
    
    // Close all modals
    function closeAllModals() {
        modals.forEach(modal => modal.classList.remove('active'));
    }
    
    // Show notification toast
    function showNotification(message) {
        const toastMessage = notificationToast.querySelector('.toast-message');
        toastMessage.textContent = message;
        
        notificationToast.classList.add('show');
        
        setTimeout(() => {
            notificationToast.classList.remove('show');
        }, 3000);
    }
    
    // Render dashboard stats
    function renderDashboardStats() {
        const totalItems = sampleItems.length;
        const packedItems = sampleItems.filter(item => item.status === 'packed').length;
        const deliveredItems = sampleItems.filter(item => item.status === 'delivered').length;
        const totalMembers = members.length;
        
        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('packed-items').innerHTML = ${packedItems} <span class="percentage">(${Math.round((packedItems / totalItems) * 100)}%)</span>;
        document.getElementById('delivered-items').innerHTML = ${deliveredItems} <span class="percentage">(${Math.round((deliveredItems / totalItems) * 100)}%)</span>;
        document.getElementById('total-members').textContent = totalMembers;
        
        // Update progress bar
        const packedPercentage = (packedItems / totalItems) * 100;
        const deliveredPercentage = (deliveredItems / totalItems) * 100;
        
        document.querySelector('.progress.packed').style.width = ${packedPercentage}%;
        document.querySelector('.progress.delivered').style.width = ${deliveredPercentage}%;
        
        // Update legend
        const unpackedPercentage = 100 - packedPercentage - deliveredPercentage;
        document.querySelector('.chart-legend').innerHTML = `
            <span><i class="fas fa-square packed"></i> Packed (${Math.round(packedPercentage)}%)</span>
            <span><i class="fas fa-square delivered"></i> Delivered (${Math.round(deliveredPercentage)}%)</span>
            <span><i class="fas fa-square unpacked"></i> Unpacked (${Math.round(unpackedPercentage)}%)</span>
        `;
    }
    
    // Render checklist items
    function renderChecklistItems() {
        checklistItemsContainer.innerHTML = '';
        
        // Filter items based on current category
        let itemsToDisplay = [...sampleItems];
        if (currentCategory !== 'all') {
            itemsToDisplay = sampleItems.filter(item => item.category === currentCategory);
        }
        
        // Filter items based on user role
        if (currentUser.role === 'member') {
            itemsToDisplay = itemsToDisplay.filter(item => item.assignedTo === 'me');
        }
        
        if (itemsToDisplay.length === 0) {
            checklistItemsContainer.innerHTML = '<div class="empty-state">No items found. Add some items to get started!</div>';
            return;
        }
        
        itemsToDisplay.forEach(item => {
            const category = categories.find(cat => cat.id === item.category);
            const assignedMember = members.find(member => member.id === item.assignedTo);
            
            const itemElement = document.createElement('div');
            itemElement.className = 'checklist-item';
            itemElement.innerHTML = `
                <div class="item-name">
                    ${item.name}
                    ${category ? <span class="item-category">${category.name}</span> : ''}
                </div>
                <div class="item-assigned">
                    <i class="fas fa-user-circle"></i>
                    ${assignedMember ? assignedMember.name : 'Unassigned'}
                </div>
                <div class="item-status">
                    <span class="status-badge ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                </div>
                <div class="item-actions">
                    ${currentUser.role !== 'viewer' ? `
                    <button class="btn-icon" data-action="edit" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" data-action="delete" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </div>
            `;
            
            checklistItemsContainer.appendChild(itemElement);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.item-actions button').forEach(button => {
            button.addEventListener('click', function() {
                const action = this.dataset.action;
                const itemId = parseInt(this.dataset.id);
                
                if (action === 'edit') {
                    editItem(itemId);
                } else if (action === 'delete') {
                    deleteItem(itemId);
                }
            });
        });
    }
    
    // Save new item
    function saveNewItem() {
        const itemName = document.getElementById('item-name').value.trim();
        const itemCategory = document.getElementById('item-category').value;
        const itemAssigned = document.getElementById('item-assigned').value;
        const itemQuantity = document.getElementById('item-quantity').value;
        const itemNotes = document.getElementById('item-notes').value.trim();
        
        if (!itemName) {
            showNotification('Please enter an item name');
            return;
        }
        
        const newItem = {
            id: sampleItems.length + 1,
            name: itemName,
            category: itemCategory,
            assignedTo: itemAssigned,
            status: 'unpacked',
            notes: itemNotes,
            quantity: itemQuantity
        };
        
        sampleItems.push(newItem);
        
        // Save to localStorage
        localStorage.setItem('packpal_items', JSON.stringify(sampleItems));
        
        // Update UI
        renderChecklistItems();
        renderDashboardStats();
        closeAllModals();
        showNotification('Item added successfully!');
        
        // Clear form
        document.getElementById('item-name').value = '';
        document.getElementById('item-notes').value = '';
    }
    
    // Save new category
    function saveNewCategory() {
        const categoryName = document.getElementById('category-name').value.trim();
        const selectedIcon = document.querySelector('.icon-option.active');
        
        if (!categoryName) {
            showNotification('Please enter a category name');
            return;
        }
        
        if (!selectedIcon) {
            showNotification('Please select an icon');
            return;
        }
        
        const iconName = selectedIcon.dataset.icon;
        
        const newCategory = {
            id: categoryName.toLowerCase().replace(/\s+/g, '-'),
            name: categoryName,
            icon: iconName
        };
        
        categories.push(newCategory);
        
        // Save to localStorage
        localStorage.setItem('packpal_categories', JSON.stringify(categories));
        
        // Update UI
        updateCategoryTabs();
        closeAllModals();
        showNotification('Category added successfully!');
        
        // Clear form
        document.getElementById('category-name').value = '';
        document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('active'));
    }
    
    // Update category tabs
    function updateCategoryTabs() {
        const tabsContainer = document.querySelector('.tabs-container');
        tabsContainer.innerHTML = '';
        
        // Add "All Items" tab
        const allTab = document.createElement('button');
        allTab.className = 'tab active';
        allTab.dataset.category = 'all';
        allTab.textContent = 'All Items';
        tabsContainer.appendChild(allTab);
        
        // Add category tabs
        categories.filter(cat => cat.id !== 'all').forEach(category => {
            const tab = document.createElement('button');
            tab.className = 'tab';
            tab.dataset.category = category.id;
            tab.innerHTML = <i class="fas fa-${category.icon}"></i> ${category.name};
            tabsContainer.appendChild(tab);
        });
        
        // Reattach event listeners
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.category;
                localStorage.setItem('packpal_currentCategory', currentCategory);
                renderChecklistItems();
            });
        });
    }
    
    // Invite new member
    function inviteNewMember() {
        const memberName = document.getElementById('member-name').value.trim();
        const memberEmail = document.getElementById('member-email').value.trim();
        const memberRole = document.getElementById('member-role').value;
        const memberMessage = document.getElementById('member-message').value.trim();
        
        if (!memberName || !memberEmail) {
            showNotification('Please enter member name and email');
            return;
        }
        
        // In a real app, this would send an invitation email
        showNotification(Invitation sent to ${memberName} (${memberEmail}) as ${memberRole});
        closeAllModals();
        
        // Clear form
        document.getElementById('member-name').value = '';
        document.getElementById('member-email').value = '';
        document.getElementById('member-message').value = '';
    }
    
    // Generate export
    function generateExport() {
        const exportFormat = document.getElementById('export-format').value;
        const exportContent = document.querySelectorAll('input[type="checkbox"]:checked');
        const exportLayout = document.getElementById('export-layout').value;
        
        // Get items based on layout
        let itemsToExport = [...sampleItems];
        
        if (exportLayout === 'categorized') {
            itemsToExport.sort((a, b) => a.category.localeCompare(b.category));
        } else if (exportLayout === 'members') {
            itemsToExport.sort((a, b) => a.assignedTo.localeCompare(b.assignedTo));
        }

        if (exportFormat === 'csv') {
            // Create CSV content
            let csvContent = 'Item Name,Category,Assigned To,Status,Quantity,Notes\n';
            
            // Add items to CSV
            itemsToExport.forEach(item => {
                const category = categories.find(cat => cat.id === item.category)?.name || item.category;
                const assignedTo = members.find(member => member.id === item.assignedTo)?.name || item.assignedTo;
                
                // Escape fields that might contain commas
                const escapeCsvField = (field) => {
                    if (field && field.includes(',')) {
                        return "${field}";
                    }
                    return field;
                };
                
                const row = [
                    escapeCsvField(item.name),
                    escapeCsvField(category),
                    escapeCsvField(assignedTo),
                    item.status,
                    item.quantity || '1',
                    escapeCsvField(item.notes || '')
                ].join(',');
                
                csvContent += row + '\n';
            });
            
            // Create and download the CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', 'packpal_checklist.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Checklist exported as CSV successfully!');
        } else if (exportFormat === 'pdf') {
            // Create PDF using jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Add title
            doc.setFontSize(20);
            doc.text('PackPal Checklist', 14, 20);

            // Add group info
            doc.setFontSize(12);
            doc.text(Group: ${document.getElementById('group-name').textContent}, 14, 30);
            doc.text(Date: ${new Date().toLocaleDateString()}, 14, 37);

            // Prepare table data
            const tableData = itemsToExport.map(item => {
                const category = categories.find(cat => cat.id === item.category)?.name || item.category;
                const assignedTo = members.find(member => member.id === item.assignedTo)?.name || item.assignedTo;
                
                return [
                    item.name,
                    category,
                    assignedTo,
                    item.status.charAt(0).toUpperCase() + item.status.slice(1),
                    item.quantity || '1',
                    item.notes || ''
                ];
            });

            // Add table
            doc.autoTable({
                head: [['Item Name', 'Category', 'Assigned To', 'Status', 'Quantity', 'Notes']],
                body: tableData,
                startY: 45,
                styles: {
                    fontSize: 10,
                    cellPadding: 3
                },
                headStyles: {
                    fillColor: [74, 111, 165],
                    textColor: 255
                },
                alternateRowStyles: {
                    fillColor: [245, 247, 250]
                }
            });

            // Add summary
            const totalItems = itemsToExport.length;
            const packedItems = itemsToExport.filter(item => item.status === 'packed').length;
            const deliveredItems = itemsToExport.filter(item => item.status === 'delivered').length;

            const finalY = doc.lastAutoTable.finalY + 10;
            doc.text('Summary:', 14, finalY);
            doc.text(Total Items: ${totalItems}, 14, finalY + 7);
            doc.text(Packed: ${packedItems} (${Math.round((packedItems/totalItems)*100)}%), 14, finalY + 14);
            doc.text(Delivered: ${deliveredItems} (${Math.round((deliveredItems/totalItems)*100)}%), 14, finalY + 21);

            // Save the PDF
            doc.save('packpal_checklist.pdf');
            
            showNotification('Checklist exported as PDF successfully!');
        } else if (exportFormat === 'print') {
            window.print();
            showNotification('Preparing printer-friendly version...');
        }
        
        closeAllModals();
    }
    
    // Edit item
    function editItem(itemId) {
        const item = sampleItems.find(item => item.id === itemId);
        if (!item) return;
        
        // Fill the edit form with item data
        document.getElementById('edit-item-id').value = item.id;
        document.getElementById('edit-item-name').value = item.name;
        document.getElementById('edit-item-category').value = item.category;
        document.getElementById('edit-item-assigned').value = item.assignedTo;
        document.getElementById('edit-item-status').value = item.status;
        document.getElementById('edit-item-quantity').value = item.quantity || 1;
        document.getElementById('edit-item-notes').value = item.notes || '';
        
        // Show the edit modal
        showModal(editItemModal);
    }
    
    // Delete item
    function deleteItem(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            const index = sampleItems.findIndex(item => item.id === itemId);
            if (index !== -1) {
                sampleItems.splice(index, 1);
                // Save to localStorage
                localStorage.setItem('packpal_items', JSON.stringify(sampleItems));
                renderChecklistItems();
                renderDashboardStats();
                showNotification('Item deleted successfully');
            }
        }
    }
    
    // Add new function to save edited item
    function saveEditItem() {
        const itemId = parseInt(document.getElementById('edit-item-id').value);
        const itemIndex = sampleItems.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
            showNotification('Item not found');
            return;
        }
        
        const updatedItem = {
            id: itemId,
            name: document.getElementById('edit-item-name').value.trim(),
            category: document.getElementById('edit-item-category').value,
            assignedTo: document.getElementById('edit-item-assigned').value,
            status: document.getElementById('edit-item-status').value,
            quantity: document.getElementById('edit-item-quantity').value,
            notes: document.getElementById('edit-item-notes').value.trim()
        };
        
        if (!updatedItem.name) {
            showNotification('Please enter an item name');
            return;
        }
        
        // Update the item in the array
        sampleItems[itemIndex] = updatedItem;
        
        // Save to localStorage
        localStorage.setItem('packpal_items', JSON.stringify(sampleItems));
        
        // Update UI
        renderChecklistItems();
        renderDashboardStats();
        closeAllModals();
        showNotification('Item updated successfully!');
    }
    
    // Setup demo login info
    function setupDemoLogin() {
        // Pre-fill demo credentials based on role selection
        roleSelect.addEventListener('change', function() {
            const role = this.value;
            usernameInput.value = role;
            passwordInput.value = ${role}123;
        });
    }
    
    // Initialize the app
    initApp();
});
