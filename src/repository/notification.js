const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');


const getNotifications = async (recipientId, role) => {
    const logger = getLogger();
    logger.info(`Getting notifications for recipient: ${recipientId} with role: ${role}`);
        let notifications = await getKnex().select(
            `${tables.Notifications}.*`,
            `${tables.Companies}.name AS sender_company_name`,
            getKnex().raw(`REPLACE( ${tables.Messages}.message, "{order_id}", ${tables.Notifications}.order_id) AS notification_message`),
            getKnex().raw(`DATE_FORMAT(${tables.Notifications}.created_at, '%d-%m-%Y %H:%i') AS last_notification_date`), 
        )
        .from(tables.Notifications)
        .where('recipient_id', recipientId)
        .andWhere('recipient_role', 'like', `%${role}%`)
        .join(tables.Customers, `${tables.Notifications}.sender_id`, `${tables.Customers}.customer_id`)
        .join(tables.Companies, `${tables.Customers}.company_id`, `${tables.Companies}.company_id`)
        .leftJoin(tables.Messages, `${tables.Notifications}.type`, `${tables.Messages}.type`)
        .orderBy('created_at', 'desc');
        
        if (role === 'supplier') {
            notifications = await getKnex().select(
                `${tables.Notifications}.*`,
                `${tables.Companies}.name AS sender_company_name`,
                getKnex().raw(`REPLACE( ${tables.Messages}.message, "{order_id}", ${tables.Notifications}.order_id) AS notification_message`)
            )
            .from(tables.Notifications)
            .where('recipient_id', recipientId)
            .andWhere('recipient_role', 'like', `%${role}%`)
            .join(tables.Suppliers, `${tables.Notifications}.sender_id`, `${tables.Suppliers}.supplier_id`)
            .join(tables.Companies, `${tables.Suppliers}.company_id`, `${tables.Companies}.company_id`)
            .leftJoin(tables.Messages, `${tables.Notifications}.type`, `${tables.Messages}.type`)
            .orderBy('created_at', 'desc');
        }
        return notifications;
       
};

const getNotificationById = async (notificationId) => {
    const logger = getLogger();
    logger.info(`Getting notification by id: ${notificationId}`);
    
    let notification = await getKnex().select(
        `${tables.Notifications}.*`,
        `${tables.Companies}.name AS sender_company_name`,
        getKnex().raw(`REPLACE(${tables.Messages}.message, "{order_id}", ${tables.Notifications}.order_id) AS notification_message`),
        `${tables.Customers}.username AS sender`,
        getKnex().raw(`DATE_FORMAT(${tables.Notifications}.created_at, '%d-%m-%Y %H:%i') AS last_notification_date`), 

    )
    .from(tables.Notifications)
    .where('notification_id', notificationId)
    .leftJoin(tables.Customers, `${tables.Notifications}.sender_id`, `${tables.Customers}.customer_id`)
    .join(tables.Companies, `${tables.Customers}.company_id`, `${tables.Companies}.company_id`)
    .leftJoin(tables.Messages, `${tables.Notifications}.type`, `${tables.Messages}.type`)
    
    return notification;
}   

const getReadNotifications = async (recipientId, role) => {
    const logger = getLogger();
    logger.info(`Getting read notifications for recipient: ${recipientId} with role: ${role}`);
    
    let notifications = await getKnex()(tables.Notifications).select(
        `${tables.Notifications}.*`,
        `${tables.Companies}.name AS sender_company_name`,
        getKnex().raw(`REPLACE(${tables.Messages}.message, "{order_id}", ${tables.Notifications}.order_id) AS notification_message`)
    )
    .where('recipient_id', recipientId)
    .andWhere('recipient_role', 'like', `%${role}%`)
    .andWhere('read', false)
    .join(tables.Customers, `${tables.Notifications}.sender_id`, `${tables.Customers}.customer_id`)
    .join(tables.Companies, `${tables.Customers}.company_id`, `${tables.Companies}.company_id`)
    .leftJoin(tables.Messages, `${tables.Notifications}.type`, `${tables.Messages}.type`)
    .orderBy('created_at', 'desc');
    
    if (role === 'supplier') {
        notifications = await getKnex().select(
            `${tables.Notifications}.*`,
            `${tables.Companies}.name AS sender_company_name`,
            getKnex().raw(`REPLACE(${tables.Messages}.message, "{order_id}", ${tables.Notifications}.order_id) AS notification_message`)
        )
        .from(tables.Notifications)
        .where('recipient_id', recipientId)
        .andWhere('recipient_role', 'like', `%${role}%`)
        .andWhere('read', false)
        .join(tables.Suppliers, `${tables.Notifications}.sender_id`, `${tables.Suppliers}.supplier_id`)
        .join(tables.Companies, `${tables.Suppliers}.company_id`, `${tables.Companies}.company_id`)
        .leftJoin(tables.Messages, `${tables.Notifications}.type`, `${tables.Messages}.type`)
        .orderBy('created_at', 'desc');
    }
    return notifications;
}

const sendNotification = async (senderId, recipientId, recipientRole, type, orderId) => {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const logger = getLogger();
    logger.info(`Sending notification from sender: ${senderId} to recipient: ${recipientId} with role: ${recipientRole}`);
    try{
    const message = await getKnex()(tables.Messages)
        .where('type', type)
        .select('message')
        .first();
    const notificationId = await getKnex().insert({
        type,
        recipient_role: JSON.stringify([recipientRole]),
        sender_id: senderId,
        recipient_id: recipientId,
        created_at: currentDate,
        read: false,
        order_id: orderId
    })
    .into(tables.Notifications)
    .returning('notification_id');
    return { notificationId, message: message.message };
   }catch (error) {
        logger.error(`Error sending notification: ${error.message}`);
        throw error;
    }
}

const changeRead = async (notificationId) => {
    const logger = getLogger();
    logger.info(`Changing read status of notification: ${notificationId}`);
    
    const notification = await getKnex()(tables.Notifications)
        .where('notification_id', notificationId)
        .update('read', true)
        .returning('*');

    return notification;
}

module.exports = {
    getNotifications,
    getNotificationById,
    getReadNotifications,
    sendNotification,
    changeRead,
}

